// 📁 src/contexts/powerChartCustomContext.jsx
// 역할: dayCustomApi로 수년치 일일 데이터(대용량)를 미리 적재(preload)하고
//       선택 기간을 잘라 가져온 뒤(즉시), 주/월 단위로 "중간 정제"해서
//       차트/표가 바로 쓰기 좋은 형태로 제공.

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  preloadDayIndex,
  fetchDayRange,
  getDayIndexInfo,
  upsertDayRows,
} from "../apis/dayCustomApi";

/* =========================
 * 유틸
 * ========================= */
function todayYMD() {
  const t = new Date();
  const y = t.getFullYear();
  const m = String(t.getMonth() + 1).padStart(2, "0");
  const d = String(t.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function addDays(ymd, diff) {
  if (!ymd) return ymd;
  const [y, m, d] = ymd.split("-").map((v) => parseInt(v, 10));
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + diff);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}
function toMonthKey(ymd) {
  return ymd?.slice(0, 7); // YYYY-MM
}
function toMondayStart(ymd) {
  // ISO 주 시작(월)
  const [y, m, d] = ymd.split("-").map((v) => parseInt(v, 10));
  const dt = new Date(y, m - 1, d);
  const day = (dt.getDay() + 6) % 7; // 월=0
  dt.setDate(dt.getDate() - day);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}
function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

function aggregateDaily(rows) {
  return rows.map((r) => ({
    date: r.date,
    power: round2(Math.max(0, r.power)),
    price: Math.max(0, Math.round(Number(r.price) || 0)),
  }));
}
function aggregateWeekly(rows) {
  const map = new Map();
  for (const r of rows) {
    const key = toMondayStart(r.date);
    const v = map.get(key) || { days: 0, powerSum: 0, priceSum: 0 };
    v.days += 1;
    v.powerSum += Math.max(0, Number(r.power) || 0);
    v.priceSum += Math.max(0, Number(r.price) || 0);
    map.set(key, v);
  }
  const out = [];
  for (const [weekStart, v] of map) {
    out.push({
      weekStart,
      powerSum: round2(v.powerSum),
      powerAvg: round2(v.powerSum / v.days),
      priceSum: Math.round(v.priceSum),
      days: v.days,
    });
  }
  out.sort((a, b) => (a.weekStart < b.weekStart ? -1 : 1));
  return out;
}
function aggregateMonthly(rows) {
  const map = new Map();
  for (const r of rows) {
    const key = toMonthKey(r.date);
    const v = map.get(key) || { days: 0, powerSum: 0, priceSum: 0 };
    v.days += 1;
    v.powerSum += Math.max(0, Number(r.power) || 0);
    v.priceSum += Math.max(0, Number(r.price) || 0);
    map.set(key, v);
  }
  const out = [];
  for (const [ym, v] of map) {
    out.push({
      ym,
      powerSum: round2(v.powerSum),
      powerAvg: round2(v.powerSum / v.days),
      priceSum: Math.round(v.priceSum),
      days: v.days,
    });
  }
  out.sort((a, b) => (a.ym < b.ym ? -1 : 1));
  return out;
}
function calcSummary(rows) {
  if (!rows?.length) {
    return {
      days: 0,
      totalPower: 0,
      avgPower: 0,
      totalPrice: 0,
      peakPower: 0,
      peakDate: null,
    };
  }
  let sumP = 0;
  let sumC = 0;
  let peakPower = -1;
  let peakDate = null;
  for (const r of rows) {
    const p = Math.max(0, Number(r.power) || 0);
    const c = Math.max(0, Number(r.price) || 0);
    sumP += p;
    sumC += c;
    if (p > peakPower) {
      peakPower = p;
      peakDate = r.date;
    }
  }
  const days = rows.length;
  return {
    days,
    totalPower: round2(sumP),
    avgPower: round2(sumP / days),
    totalPrice: Math.round(sumC),
    peakPower: round2(peakPower),
    peakDate,
  };
}

/* =========================
 * 컨텍스트
 * ========================= */
const PowerChartCustomContext = createContext(null);

export function PowerChartCustomProvider({
  children,
  // ✅ 기본을 최근 1년으로
  defaultDays = 365,
  dailyLimit = 1500,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [indexInfo, setIndexInfo] = useState({
    ready: false,
    count: 0,
    minDate: null,
    maxDate: null,
  });

  // ✅ range는 초기 null → 인덱스 준비 후 ‘최근 1년’으로 1회 설정
  const [range, setRange] = useState(null); // { start, end } | null
  const [viewMode, setViewMode] = useState("daily"); // 'daily' | 'weekly' | 'monthly'
  const [limit, setLimit] = useState(dailyLimit);
  const [dailyRows, setDailyRows] = useState([]);

  // 내부: 기본 범위 계산 (가용 데이터 최신일을 end로)
  const computeDefaultRange = useCallback(
    (info) => {
      if (!info?.maxDate) {
        const td = todayYMD();
        return { start: addDays(td, -Math.abs(defaultDays) + 1), end: td };
      }
      const end = info.maxDate;
      let start = addDays(end, -Math.abs(defaultDays) + 1);
      if (info.minDate && start < info.minDate) start = info.minDate;
      if (start > end) start = end; // 보호
      return { start, end };
    },
    [defaultDays]
  );

  // 1) 인덱스 프리로드
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const info = await preloadDayIndex();
        if (cancelled) return;
        setIndexInfo(info);
        setError("");
      } catch (e) {
        console.error(e);
        if (!cancelled) setError(e?.message || "Failed to preload day index");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2) 인덱스가 준비되면 기본 범위를 ‘최근 1년’으로 1회 설정
  const didInitRangeRef = useRef(false);
  useEffect(() => {
    if (!indexInfo.ready) return;
    if (didInitRangeRef.current) return;
    const def = computeDefaultRange(indexInfo);
    setRange(def);
    didInitRangeRef.current = true;
  }, [indexInfo.ready, indexInfo.minDate, indexInfo.maxDate, computeDefaultRange]);

  // 3) 선택 기간 로드(즉시 슬라이스)
  const loadRange = useCallback(
    async (s, e, lmt = limit) => {
      try {
        setLoading(true);
        const rows = await fetchDayRange(s, e, { limit: lmt });
        setDailyRows(aggregateDaily(rows));
        setError("");
      } catch (e) {
        console.error(e);
        setError(e?.message || "Failed to fetch day range");
        setDailyRows([]);
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  // 4) 인덱스 준비 + range 존재 시 데이터 로드
  useEffect(() => {
    if (!indexInfo.ready) return;
    if (!range?.start || !range?.end) return;
    loadRange(range.start, range.end, limit);
  }, [indexInfo.ready, range?.start, range?.end, limit, loadRange]);

  // 5) 증분 반영(옵션)
  const applyIncremental = useCallback(
    async (newRows) => {
      try {
        await upsertDayRows(newRows);
        const info = getDayIndexInfo();
        setIndexInfo(info);
        // 현재 선택 기간 갱신
        if (range?.start && range?.end) {
          await loadRange(range.start, range.end, limit);
        } else {
          // range가 없으면 기본 범위를 다시 설정
          const def = computeDefaultRange(info);
          setRange(def);
        }
      } catch (e) {
        console.error(e);
        setError(e?.message || "Failed to upsert day rows");
      }
    },
    [range?.start, range?.end, limit, loadRange, computeDefaultRange]
  );

  // 6) 주/월 단위 중간 정제
  const weeklyData = useMemo(() => aggregateWeekly(dailyRows), [dailyRows]);
  const monthlyData = useMemo(() => aggregateMonthly(dailyRows), [dailyRows]);
  const summary = useMemo(() => calcSummary(dailyRows), [dailyRows]);

  // 7) 차트용 대표 시리즈 선택
  const chartData = useMemo(() => {
    switch (viewMode) {
      case "weekly":
        return weeklyData.map((w) => ({
          date: w.weekStart,
          power: w.powerSum,
          price: w.priceSum,
        }));
      case "monthly":
        return monthlyData.map((m) => ({
          date: `${m.ym}-01`,
          power: m.powerSum,
          price: m.priceSum,
        }));
      case "daily":
      default:
        return dailyRows;
    }
  }, [viewMode, dailyRows, weeklyData, monthlyData]);

  // 8) 공개 API
  const setSelectedRange = useCallback((startYmd, endYmd) => {
    setRange({ start: startYmd, end: endYmd });
  }, []);

  const refresh = useCallback(async () => {
    const info = getDayIndexInfo();
    if (!info.ready) {
      const newInfo = await preloadDayIndex({ force: true });
      setIndexInfo(newInfo);
      // 인덱스를 다시 만들었으니 기본 범위 재설정
      const def = computeDefaultRange(newInfo);
      setRange(def);
    } else {
      setIndexInfo(info);
      if (range?.start && range?.end) {
        await loadRange(range.start, range.end, limit);
      } else {
        const def = computeDefaultRange(info);
        setRange(def);
      }
    }
  }, [range?.start, range?.end, limit, loadRange, computeDefaultRange]);

  const value = useMemo(
    () => ({
      // 상태
      loading,
      error,
      ready: indexInfo.ready,
      indexInfo, // {ready, count, minDate, maxDate}
      range: range ?? { start: null, end: null },
      viewMode, // 'daily' | 'weekly' | 'monthly'
      limit, // 일 단위 다운샘플 제한
      // 원본/정제 데이터
      dailyRows, // [{date, power, price}]
      weeklyData, // [{weekStart, powerSum, powerAvg, priceSum, days}]
      monthlyData, // [{ym, powerSum, powerAvg, priceSum, days}]
      chartData, // viewMode에 맞춘 대표 시리즈
      summary, // {days, totalPower, avgPower, totalPrice, peakPower, peakDate}
      // 동작
      setSelectedRange, // (startYmd, endYmd)
      setViewMode, // ('daily'|'weekly'|'monthly')
      setLimit, // (n)
      refresh, // () => Promise<void>
      applyIncremental, // (newRows[]) => Promise<void>
    }),
    [
      loading,
      error,
      indexInfo,
      range,
      viewMode,
      limit,
      dailyRows,
      weeklyData,
      monthlyData,
      chartData,
      summary,
      setSelectedRange,
      setViewMode,
      setLimit,
      refresh,
      applyIncremental,
    ]
  );

  return (
    <PowerChartCustomContext.Provider value={value}>
      {children}
    </PowerChartCustomContext.Provider>
  );
}

export function usePowerChartCustom() {
  const ctx = useContext(PowerChartCustomContext);
  if (!ctx) {
    throw new Error("usePowerChartCustom must be used within PowerChartCustomProvider");
  }
  return ctx;
}
