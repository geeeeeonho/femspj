// 📁 src/components/power/customChartUp.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePowerChartCustom } from "../../contexts/powerChartCustomContext";

/* =========================
 * 유틸
 * ========================= */
const DAY = 86_400_000;

const parseYMD = (s) => {
  if (!s) return null;
  const [y, m, d] = String(s)
    .slice(0, 10)
    .replace(/[./]/g, "-")
    .split("-")
    .map((n) => parseInt(n, 10));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};
const toYMD = (d) => {
  if (!(d instanceof Date)) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};
const toMidnightTs = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
const toTs = (ymd) => {
  const d = parseYMD(ymd);
  return d ? toMidnightTs(d) : NaN;
};
const fmtTick = (t) => toYMD(new Date(t));
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

/* =========================
 * 커스텀 범위 바 (내장, 라벨 포함)
 * ========================= */
function RangeBar({
  minDate,
  maxDate,
  startDate,
  endDate,
  onChange,
  minSpanDays = 1,
  height = 26,
}) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  // 도메인/스케일
  const minT = useMemo(() => (minDate ? toTs(minDate) : 0), [minDate]);
  const maxT = useMemo(() => (maxDate ? toTs(maxDate) : 0), [maxDate]);
  const spanT = Math.max(1, maxT - minT);

  const startT = useMemo(
    () => (startDate ? toTs(startDate) : minT),
    [startDate, minT]
  );
  const endT = useMemo(() => (endDate ? toTs(endDate) : maxT), [endDate, maxT]);

  const xFromT = (t) => ((t - minT) / spanT) * (width || 1);
  const tFromX = (x) => minT + (clamp(x, 0, width) / (width || 1)) * spanT;

  // 반응형 width 추적
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setWidth(e.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // 현재 선택의 픽셀 좌표
  const sel = useMemo(() => {
    const sx = xFromT(startT);
    const ex = xFromT(endT);
    return { sx: Math.min(sx, ex), ex: Math.max(sx, ex) };
  }, [startT, endT, width]);

  // 최소 폭(px): 최소 일수 이상 + 시각적 하한(6px)
  const minPixels = useMemo(() => {
    const totalDays = Math.max(1, Math.round(spanT / DAY));
    return Math.max(6, (minSpanDays / totalDays) * (width || 1));
  }, [spanT, width, minSpanDays]);

  // 드래그 상태
  const dragRef = useRef(null); // {type:'left'|'right'|'inside', startX, baseSX, baseEX, selWidth, offset}
  const rafRef = useRef(null);

  const emit = (sT, eT) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      // 일 단위 스냅
      const s = new Date(Math.round(sT / DAY) * DAY);
      const e = new Date(Math.round(eT / DAY) * DAY);
      onChange?.({ startDate: toYMD(s), endDate: toYMD(e) });
    });
  };

  const getX = (ev) => {
    const rect = containerRef.current.getBoundingClientRect();
    if ("touches" in ev) return ev.touches[0].clientX - rect.left;
    return ev.clientX - rect.left;
  };

  const onDown = (type) => (ev) => {
    ev.preventDefault();
    if (!containerRef.current) return;
    const x = getX(ev);
    dragRef.current = {
      type,
      startX: x,
      baseSX: sel.sx,
      baseEX: sel.ex,
      selWidth: sel.ex - sel.sx,
      offset:
        x -
        (type === "left"
          ? sel.sx
          : type === "right"
          ? sel.ex
          : (sel.sx + sel.ex) / 2),
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
  };

  const onMove = (ev) => {
    if (!dragRef.current) return;
    ev.preventDefault();
    const { type, baseSX, baseEX, selWidth, offset } = dragRef.current;
    const x = getX(ev);
    let sx = baseSX,
      ex = baseEX;

    if (type === "left") {
      sx = clamp(x, 0, baseEX - minPixels);
      ex = baseEX;
    } else if (type === "right") {
      sx = baseSX;
      ex = clamp(x, baseSX + minPixels, width);
    } else {
      // inside 이동
      const w = Math.max(minPixels, selWidth);
      const nx = clamp(x - offset - w / 2, 0, width - w);
      sx = nx;
      ex = nx + w;
    }

    emit(tFromX(sx), tFromX(ex));
  };

  const onUp = () => {
    dragRef.current = null;
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    window.removeEventListener("touchmove", onMove);
    window.removeEventListener("touchend", onUp);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // ------- 라벨(시작/종료) -------
  const labelSpace = 22; // 바 위 라벨 영역 높이
  const containerH = height + labelSpace;

  const clampX = (x) => clamp(Math.round(x), 20, Math.max(20, (width || 1) - 20));
  const compact = sel.ex - sel.sx < 100; // 좁으면 한 줄 라벨로 합침
  const startLabelX = clampX(sel.sx);
  const endLabelX = clampX(sel.ex);
  const midLabelX = clampX((sel.sx + sel.ex) / 2);

  const labelBase = {
    position: "absolute",
    top: 2,
    transform: "translateX(-50%)",
    background: "#111827",
    color: "white",
    fontSize: 11,
    lineHeight: "16px",
    padding: "2px 6px",
    borderRadius: 6,
    whiteSpace: "nowrap",
    boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
    pointerEvents: "none",
  };

  // 스타일
  const trackStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    top: labelSpace,
    height,
    background: "#dbeafe",
    borderRadius: 6,
  };
  const selStyle = {
    position: "absolute",
    top: labelSpace,
    left: sel.sx,
    width: Math.max(0, sel.ex - sel.sx),
    height,
    background: "#bfdbfe",
    border: "1px solid #60a5fa",
    borderRadius: 6,
    pointerEvents: "none",
  };
  const handleStyle = (x) => ({
    position: "absolute",
    top: labelSpace,
    left: x - 6,
    width: 12,
    height,
    background: "#1d4ed8",
    borderRadius: 6,
    cursor: "col-resize",
  });
  const insideStyle = {
    position: "absolute",
    top: labelSpace,
    left: sel.sx,
    width: Math.max(0, sel.ex - sel.sx),
    height,
    cursor: "grab",
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      style={{ height: containerH, touchAction: "none" }}
    >
      {/* 라벨 */}
      {compact ? (
        <div style={{ ...labelBase, left: midLabelX }}>
          {`${startDate ?? ""} ~ ${endDate ?? ""}`}
        </div>
      ) : (
        <>
          <div style={{ ...labelBase, left: startLabelX }}>{startDate ?? ""}</div>
          <div style={{ ...labelBase, left: endLabelX }}>{endDate ?? ""}</div>
        </>
      )}

      {/* 트랙/선택/핸들 */}
      <div style={trackStyle} />
      <div style={selStyle} />
      <div
        style={handleStyle(sel.sx)}
        onMouseDown={onDown("left")}
        onTouchStart={onDown("left")}
      />
      <div
        style={handleStyle(sel.ex)}
        onMouseDown={onDown("right")}
        onTouchStart={onDown("right")}
      />
      <div
        style={insideStyle}
        onMouseDown={onDown("inside")}
        onTouchStart={onDown("inside")}
      />
    </div>
  );
}

/* =========================
 * 상단 차트 + 커스텀 범위 바
 * ========================= */
function CustomChartUpComponent({ onRangeChange }) {
  const {
    ready,
    indexInfo, // {minDate, maxDate}
    range, // {start, end}
    viewMode, // 'daily' | 'weekly' | 'monthly'
    setViewMode,
    setSelectedRange, // (startYmd, endYmd)
    chartData, // [{date, power, price}]
  } = usePowerChartCustom();

  // 전체 도메인 타임스탬프
  const minT = useMemo(
    () => (indexInfo?.minDate ? toTs(indexInfo.minDate) : 0),
    [indexInfo?.minDate]
  );
  const maxT = useMemo(
    () => (indexInfo?.maxDate ? toTs(indexInfo.maxDate) : 0),
    [indexInfo?.maxDate]
  );

  // 메인 시리즈: 숫자축(t)으로 매핑
  const series = useMemo(
    () =>
      (chartData ?? [])
        .map((r) => ({ ...r, t: toTs(r.date) }))
        .filter((r) => Number.isFinite(r.t)),
    [chartData]
  );

  // 선택 구간 도메인 (없으면 전체)
  const selStartT = useMemo(() => {
    const t = range?.start ? toTs(range.start) : NaN;
    return Number.isFinite(t) ? t : minT;
  }, [range?.start, minT]);
  const selEndT = useMemo(() => {
    const t = range?.end ? toTs(range.end) : NaN;
    return Number.isFinite(t) ? t : maxT;
  }, [range?.end, maxT]);

  // 컨텍스트 반영은 디바운스(너무 잦은 재계산 방지)
  const commitRef = useRef(null);
  const commitRange = useCallback(
    (s, e) => {
      if (commitRef.current) clearTimeout(commitRef.current);
      commitRef.current = setTimeout(() => {
        setSelectedRange(s, e);
        onRangeChange?.({ startDate: s, endDate: e });
      }, 120);
    },
    [setSelectedRange, onRangeChange]
  );
  useEffect(() => () => clearTimeout(commitRef.current), []);

  if (!ready) {
    return (
      <div className="mb-6">
        <h2 className="font-bold mb-2">📈 전력 소비 추이</h2>
        <div className="h-72 bg-gray-100 animate-pulse rounded" />
      </div>
    );
  }

  const minD = parseYMD(indexInfo.minDate) || undefined;
  const maxD = parseYMD(indexInfo.maxDate) || undefined;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold">📈 전력 소비 추이</h2>

        {/* 보기 모드 토글 */}
        <div className="flex gap-1 text-sm">
          {["daily", "weekly", "monthly"].map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`px-3 py-1 rounded border ${
                viewMode === m
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {m === "daily" ? "일" : m === "weekly" ? "주" : "월"}
            </button>
          ))}
        </div>
      </div>

      {/* 날짜 피커 + 빠른 버튼 */}
      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm px-1">
        <div className="flex items-center gap-1">
          <span className="text-gray-700 font-medium">시작일:</span>
          <DatePicker
            selected={parseYMD(range?.start)}
            onChange={(picked) => {
              const start = toYMD(picked);
              const end = range?.end || start;
              commitRange(start, end);
            }}
            dateFormat="yyyy-MM-dd"
            placeholderText="날짜 선택"
            className="border px-2 py-1 rounded shadow-sm"
            minDate={minD}
            maxDate={maxD}
          />
        </div>
        <span className="font-bold">~</span>
        <div className="flex items-center gap-1">
          <span className="text-gray-700 font-medium">종료일:</span>
          <DatePicker
            selected={parseYMD(range?.end)}
            onChange={(picked) => {
              const end = toYMD(picked);
              const start = range?.start || end;
              commitRange(start, end);
            }}
            dateFormat="yyyy-MM-dd"
            placeholderText="날짜 선택"
            className="border px-2 py-1 rounded shadow-sm"
            minDate={minD}
            maxDate={maxD}
          />
        </div>

        <div className="ml-auto flex gap-1">
          <QuickBtn label="7일" onClick={() => quickSetDays(7)} />
          <QuickBtn label="30일" onClick={() => quickSetDays(30)} />
          <QuickBtn label="90일" onClick={() => quickSetDays(90)} />
          <QuickBtn label="1년" onClick={() => quickSetDays(365)} />
          <QuickBtn label="YTD" onClick={() => quickSetYTD()} />
          <QuickBtn label="전체" onClick={() => quickSetAll()} />
        </div>
      </div>

      {/* 메인 차트 */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
          <XAxis
            type="number"
            dataKey="t"
            domain={[selStartT, selEndT]} // 선택 구간만 꽉 채움
            tickFormatter={fmtTick}
            allowDataOverflow
          />
          <YAxis tick={{ fill: "#000", fontSize: 12 }} />
          <Tooltip
            labelFormatter={(t) => fmtTick(t)}
            contentStyle={{ backgroundColor: "#e0f2fe", borderColor: "#0284c7" }}
            formatter={(v) => [`${v} kWh`, "소비량"]}
          />
          <Line
            type="monotone"
            dataKey="power"
            stroke="#0284c7"
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* 커스텀 범위 바: 항상 전체 기간을 트랙으로 표시 + 라벨 표시 */}
      <div className="mt-2">
        <RangeBar
          minDate={indexInfo.minDate}
          maxDate={indexInfo.maxDate}
          startDate={range?.start}
          endDate={range?.end}
          minSpanDays={1}
          height={26}
          onChange={({ startDate, endDate }) => commitRange(startDate, endDate)}
        />
      </div>
    </div>
  );

  /* ---------- 퀵버튼 헬퍼 ---------- */
  function quickSetDays(days) {
    if (!indexInfo.maxDate) return;
    const end = indexInfo.maxDate;
    const endD = parseYMD(end);
    const s = new Date(endD);
    s.setDate(s.getDate() - days + 1);
    const start = toYMD(s);
    commitRange(start, end);
  }
  function quickSetYTD() {
    if (!indexInfo.maxDate) return;
    const end = indexInfo.maxDate;
    const jan1 = `${end.slice(0, 4)}-01-01`;
    commitRange(jan1, end);
  }
  function quickSetAll() {
    if (!indexInfo.minDate || !indexInfo.maxDate) return;
    commitRange(indexInfo.minDate, indexInfo.maxDate);
  }
}

function QuickBtn({ label, onClick }) {
  return (
    <button className="px-2 py-1 border rounded hover:bg-gray-50" onClick={onClick}>
      {label}
    </button>
  );
}

export default CustomChartUpComponent;
