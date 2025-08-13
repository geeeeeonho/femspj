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

function CustomChartUpComponent({ data, onRangeChange }) {
  // ✅ brushRange만 진실의 원천(Single Source of Truth)
  const [brushRange, setBrushRange] = useState({
    startIndex: 0,
    endIndex: Math.max(0, (data?.length ?? 1) - 1),
  });

  // 마지막으로 부모에 알린 범위(루프 방지)
  const lastEmittedRef = useRef(null);
  const didInitRef = useRef(false);

  // ----- 유틸: 날짜 포맷/파서(로컬, KST 기준) -----
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

  // 데이터 날짜 목록 (정렬 가정; 필요시 여기서 정렬)
  const dateList = useMemo(() => (data ?? []).map((d) => d.date), [data]);

  // ----- 파생 값: DatePicker 표시용 시작/종료일 -----
  const startDate = useMemo(() => {
    if (!data?.length) return null;
    const i = Math.max(0, Math.min(brushRange.startIndex, data.length - 1));
    return parseYMD(data[i].date);
  }, [data, brushRange.startIndex]);

  const endDate = useMemo(() => {
    if (!data?.length) return null;
    const i = Math.max(0, Math.min(brushRange.endIndex, data.length - 1));
    return parseYMD(data[i].date);
  }, [data, brushRange.endIndex]);

  // ----- DatePicker → brushRange 계산(정확 일치 없어도 포함 인덱스 찾기) -----
  const rangeFromPickedDates = (sDate, eDate) => {
    if (!sDate || !eDate || !dateList.length) return null;
    const s = toYMD(sDate);
    const e = toYMD(eDate);

    // 시작: s 이상인 첫 번째 인덱스
    const sIdx = dateList.findIndex((d) => d >= s);

    // 종료: e 이하인 마지막 인덱스
    let eIdx = -1;
    for (let i = dateList.length - 1; i >= 0; i--) {
      if (dateList[i] <= e) {
        eIdx = i;
        break;
      }
    }
    if (sIdx === -1 || eIdx === -1 || sIdx > eIdx) return null;
    return { startIndex: sIdx, endIndex: eIdx };
  };

  // ----- data가 바뀌면 기본 범위(전체)로 초기화 + 최초 1회만 부모에 통지 -----
  useEffect(() => {
    if (data?.length) {
      const next = { startIndex: 0, endIndex: data.length - 1 };
      setBrushRange(next);
      didInitRef.current = false; // 다음 effect에서 최초 1회 통지
    } else {
      setBrushRange({ startIndex: 0, endIndex: 0 });
      didInitRef.current = false;
      lastEmittedRef.current = null;
    }
  }, [data]);

  // ----- brushRange가 바뀌면 부모에 통지(변화 있을 때만) -----
  useEffect(() => {
    if (!data?.length) return;
    const current = {
      startIndex: Math.max(0, Math.min(brushRange.startIndex, data.length - 1)),
      endIndex: Math.max(0, Math.min(brushRange.endIndex, data.length - 1)),
    };
    // 최초 데이터 세팅 후 한 번만 통지하거나, 실제 변화 시에만 통지
    if (!didInitRef.current || !equalRange(current, lastEmittedRef.current)) {
      onRangeChange?.(current);
      didInitRef.current = true;
      lastEmittedRef.current = current;
    }
  }, [brushRange, data, onRangeChange]);

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
            minDate={parseYMD(dateList[0]) || undefined}
            maxDate={parseYMD(dateList[dateList.length - 1]) || undefined}
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
            minDate={parseYMD(dateList[0]) || undefined}
            maxDate={parseYMD(dateList[dateList.length - 1]) || undefined}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
          <Brush
            dataKey="date"
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
                data?.length
              ) {
                const sIdx = Math.max(0, Math.min(range.startIndex, data.length - 1));
                const eIdx = Math.max(0, Math.min(range.endIndex, data.length - 1));
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
