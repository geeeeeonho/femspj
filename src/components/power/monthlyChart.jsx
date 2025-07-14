// 📄 파일: src/components/power/monthlyChart.jsx
// 📊 월간 전력 소비 차트 (요일 포함, 색상별 피크 강조 + 하단 표)

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { usePowerChart } from "../../contexts/PowerChartContext";

function MonthlyChartComponent() {
  const { monthlyData } = usePowerChart();

  // 🔍 정렬하여 상위 7개 추출
  const sorted = [...monthlyData].sort((a, b) => b.power - a.power);
  const top3 = sorted.slice(0, 3).map((d) => d.date);
  const top7 = sorted.slice(0, 7);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">📅 월간 전력 소비 추이</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(v) => `${v}일`} />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} kWh`, "소비량"]}
            labelFormatter={(label) => {
              const item = monthlyData.find((d) => d.date === label);
              return `${label}일 (${item?.weekday})`;
            }}
          />
          <Line
            type="monotone"
            dataKey="power"
            stroke="#8884d8"
            strokeWidth={2}
            dot={({ cx, cy, payload }) => {
              const isTop3 = top3.includes(payload.date);
              const isTop7 = top7.find((d) => d.date === payload.date);
              const color = isTop3
                ? "#ff4d4f" // 🔴 빨강
                : isTop7
                ? "#f97316" // 🧡 진한 주황
                : "#facc15"; // 🟡 노랑
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill={color}
                  stroke="#fff"
                  strokeWidth={1}
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* 📋 하단 표: TOP 7 (반응형 폭, 제목 왼쪽, 표 글자 모두 가운데 정렬) */}
      <div className="mt-6 w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
        <h3 className="text-sm font-semibold mb-2">🔥 전력 소비 TOP 7</h3>
        <table className="w-full text-sm border border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-center">순위</th>
              <th className="border px-2 py-1 text-center">날짜</th>
              <th className="border px-2 py-1 text-center">요일</th>
              <th className="border px-2 py-1 text-center">소비량</th>
            </tr>
          </thead>
          <tbody>
            {top7.map((item, idx) => {
              const rowStyle =
                idx < 3
                  ? "bg-red-100 text-black font-bold"
                  : "bg-orange-100 text-black";
              return (
                <tr key={item.date} className={`border-t border-gray-300 ${rowStyle} text-center`}>
                  <td className="border px-2 py-1 text-center">{idx + 1}위</td>
                  <td className="border px-2 py-1 text-center">{item.date}일</td>
                  <td className="border px-2 py-1 text-center">{item.weekday}</td>
                  <td className="border px-2 py-1 text-center">{item.power} kWh</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MonthlyChartComponent;
