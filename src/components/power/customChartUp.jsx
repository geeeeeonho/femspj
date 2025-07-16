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
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CustomChartUpComponent({ data, onRangeChange }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [brushRange, setBrushRange] = useState({
    startIndex: 0,
    endIndex: data.length - 1,
  });

  const formatDate = (d) => d.toISOString().slice(0, 10);
  const dateList = data.map((d) => d.date);

  useEffect(() => {
    if (startDate && endDate) {
      const startStr = formatDate(startDate);
      const endStr = formatDate(endDate);
      const startIdx = dateList.indexOf(startStr);
      const endIdx = dateList.indexOf(endStr);

      if (startIdx !== -1 && endIdx !== -1 && startIdx <= endIdx) {
        setBrushRange({ startIndex: startIdx, endIndex: endIdx });
        onRangeChange({ startIndex: startIdx, endIndex: endIdx });
      }
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (data.length > 0 && !startDate && !endDate) {
      setStartDate(new Date(data[0].date));
      setEndDate(new Date(data[data.length - 1].date));
    }
  }, [data]);

  return (
    <div className="mb-6">
      <h2 className="font-bold mb-2">📈 전력 소비 추이</h2>

      <div className="flex items-center gap-3 mb-4 text-sm px-1">
        <div className="flex items-center gap-1">
          <span className="text-gray-700 font-medium">시작일:</span>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="날짜 선택"
            className="border px-2 py-1 rounded shadow-sm"
          />
        </div>
        <span className="font-bold">~</span>
        <div className="flex items-center gap-1">
          <span className="text-gray-700 font-medium">종료일:</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="날짜 선택"
            className="border px-2 py-1 rounded shadow-sm"
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
            dot={false}         // ✅ 점 제거
            activeDot={false}   // ✅ hover 점 제거
          />
          <Brush
            dataKey="date"
            height={24}
            stroke="#0369a1"
            startIndex={brushRange.startIndex}
            endIndex={brushRange.endIndex}
            travellerWidth={12}
            fill="#e0f2fe"
            handleStyle={{ fill: "#0ea5e9" }} // 손잡이 (양 끝 점)
            travellerStyle={{ fill: "#1e3a8a" }} // ✅ 이동 가능한 막대 색 (진한 남색)
            onChange={(range) => {
              if (range?.startIndex != null && range?.endIndex != null) {
                setBrushRange(range);
                onRangeChange(range);
                setStartDate(new Date(data[range.startIndex].date));
                setEndDate(new Date(data[range.endIndex].date));
              }
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomChartUpComponent;
