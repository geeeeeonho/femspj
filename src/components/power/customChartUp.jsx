// 📁 src/components/power/customChartUp.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
} from "recharts";
import { useEffect, useMemo, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePowerChart } from "../../contexts/powerChartContext"; // ← 전체 데이터 사용

function CustomChartUpComponent({ data, onRangeChange }) {
  const { monthlyData } = usePowerChart();

  // ✅ 전체 데이터: 부모가 넘긴 data보다 컨텍스트가 더 크면 컨텍스트 우선
  const fullData = useMemo(() => {
    const a = Array.isArray(data) ? data : [];
    const b = Array.isArray(monthlyData) ? monthlyData : [];
    return b.length > a.length ? b : a;
  }, [data, monthlyData]);

  // ✅ 선택된 인덱스 범위 (fullData 기준)
  const [brushRange, setBrushRange] = useState({
    startIndex: 0,
    endIndex: Math.max(0, (fullData?.length ?? 1) - 1),
  });

  const lastEmittedRef = useRef(null);
  const didInitRef = useRef(false);

  // ----- 유틸: 로컬(KST) 안전 포맷/파서 -----
  const toYMD = (d) => {
    if (!(d instanceof Date)) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };
  const parseYMD = (s) => {
    if (!s) return null;
    const [y, m, d] = String(s).slice(0, 10).replace(/[./]/g, "-").split("-").map((n) => parseInt(n, 10));
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };
  const equalRange = (a, b) =>
    !!a && !!b && a.startIndex === b.startIndex && a.endIndex === b.endIndex;

  const fullDateList = useMemo(() => (fullData ?? []).map((d) => d.date), [fullData]);

  // ✅ 선택 구간(visibleData): 차트에는 이 부분만 렌더 → 성능 확보
  const visibleData = useMemo(() => {
    if (!fullData?.length) return [];
    const s = Math.max(0, Math.min(brushRange.startIndex, fullData.length - 1));
    const e = Math.max(0, Math.min(brushRange.endIndex, fullData.length - 1));
    return fullData.slice(Math.min(s, e), Math.max(s, e) + 1);
  }, [fullData, brushRange]);

  // ✅ DatePicker 표시용 날짜
  const startDate = useMemo(() => {
    if (!fullData?.length) return null;
    const i = Math.max(0, Math.min(brushRange.startIndex, fullData.length - 1));
    return parseYMD(fullData[i].date);
  }, [fullData, brushRange.startIndex]);

  const endDate = useMemo(() => {
    if (!fullData?.length) return null;
    const i = Math.max(0, Math.min(brushRange.endIndex, fullData.length - 1));
    return parseYMD(fullData[i].date);
  }, [fullData, brushRange.endIndex]);

  // ✅ DatePicker → 전체 날짜목록에서 포함 인덱스 찾기
  const rangeFromPickedDates = (sDate, eDate) => {
    if (!sDate || !eDate || !fullDateList.length) return null;
    const s = toYMD(sDate);
    const e = toYMD(eDate);

    const sIdx = fullDateList.findIndex((d) => d >= s);
    let eIdx = -1;
    for (let i = fullDateList.length - 1; i >= 0; i--) {
      if (fullDateList[i] <= e) { eIdx = i; break; }
    }
    if (sIdx === -1 || eIdx === -1 || sIdx > eIdx) return null;
    return { startIndex: sIdx, endIndex: eIdx };
  };

  // ✅ fullData가 바뀌면 범위를 전체로 초기화(= 12만일 전체 커버)
  useEffect(() => {
    if (fullData?.length) {
      const next = { startIndex: 0, endIndex: fullData.length - 1 };
      setBrushRange(next);
      didInitRef.current = false;
    } else {
      setBrushRange({ startIndex: 0, endIndex: 0 });
      didInitRef.current = false;
      lastEmittedRef.current = null;
    }
  }, [fullData]);

  // ✅ 부모 알림 (fullData 기준 인덱스)
  useEffect(() => {
    if (!fullData?.length) return;
    const current = {
      startIndex: Math.max(0, Math.min(brushRange.startIndex, fullData.length - 1)),
      endIndex: Math.max(0, Math.min(brushRange.endIndex, fullData.length - 1)),
    };
    if (!didInitRef.current || !equalRange(current, lastEmittedRef.current)) {
      onRangeChange?.(current);
      didInitRef.current = true;
      lastEmittedRef.current = current;
    }
  }, [brushRange, fullData, onRangeChange]);

  return (
    <div className="mb-6">
      <h2 className="font-bold mb-2">📈 전력 소비 추이</h2>

      <div className="flex items-center gap-3 mb-4 text-sm px-1">
        <div className="flex items-center gap-1">
          <span className="text-gray-700 font-medium">시작일:</span>
          <DatePicker
            selected={startDate}
            onChange={(picked) => {
              const next = rangeFromPickedDates(picked, endDate ?? picked);
              if (next) setBrushRange(next);
            }}
            dateFormat="yyyy-MM-dd"
            placeholderText="날짜 선택"
            className="border px-2 py-1 rounded shadow-sm"
            minDate={parseYMD(fullDateList[0]) || undefined}
            maxDate={parseYMD(fullDateList[fullDateList.length - 1]) || undefined}
          />
        </div>
        <span className="font-bold">~</span>
        <div className="flex items-center gap-1">
          <span className="text-gray-700 font-medium">종료일:</span>
          <DatePicker
            selected={endDate}
            onChange={(picked) => {
              const next = rangeFromPickedDates(startDate ?? picked, picked);
              if (next) setBrushRange(next);
            }}
            dateFormat="yyyy-MM-dd"
            placeholderText="날짜 선택"
            className="border px-2 py-1 rounded shadow-sm"
            minDate={parseYMD(fullDateList[0]) || undefined}
            maxDate={parseYMD(fullDateList[fullDateList.length - 1]) || undefined}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {/* 메인 차트는 선택된 구간(visibleData)만 렌더 → 성능 */}
        <LineChart data={visibleData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
          <XAxis dataKey="date" tick={{ fill: "#000", fontSize: 12 }} />
          <YAxis tick={{ fill: "#000", fontSize: 12 }} />
          <Tooltip
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
          {/* ✅ 브러시는 fullData 전체를 기준으로 동작 */}
          <Brush
            dataKey="date"
            data={fullData}                 // ← 전체(12만일) 기준
            height={24}
            stroke="#0369a1"
            startIndex={brushRange.startIndex}
            endIndex={brushRange.endIndex}
            travellerWidth={12}
            fill="#e0f2fe"
            handleStyle={{ fill: "#0ea5e9" }}
            travellerStyle={{ fill: "#1e3a8a" }}
            onChange={(range) => {
              if (
                range?.startIndex != null &&
                range?.endIndex != null &&
                fullData?.length
              ) {
                const sIdx = Math.max(0, Math.min(range.startIndex, fullData.length - 1));
                const eIdx = Math.max(0, Math.min(range.endIndex, fullData.length - 1));
                setBrushRange({
                  startIndex: Math.min(sIdx, eIdx),
                  endIndex: Math.max(sIdx, eIdx),
                });
              }
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomChartUpComponent;
