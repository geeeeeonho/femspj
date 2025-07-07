// 📄 파일: src/components/power/weeklyChart.jsx
// 📊 주간 전력 소비 차트 (월간 차트와 동일한 색상 스타일)

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// 샘플 주간 데이터
const data = [
  { day: "월", power: 240 },
  { day: "화", power: 260 },
  { day: "수", power: 210 },
  { day: "목", power: 280 },
  { day: "금", power: 310 },
  { day: "토", power: 260 },
  { day: "일", power: 220 },
];

// 정렬 기준: 소비량 내림차순
const sorted = [...data].sort((a, b) => b.power - a.power);
const top1 = sorted.slice(0, 1).map((d) => d.day);
const top3 = sorted.slice(0, 3);

function WeeklyChartComponent() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">📆 주간 전력 소비 추이</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="power"
            stroke="#8884d8"
            strokeWidth={2}
            dot={({ cx, cy, payload }) => {
              const isTop1 = top1.includes(payload.day);
              const isTop3 = top3.find((t) => t.day === payload.day);
              const color = isTop1
                ? "#ff4d4f" // 🔴
                : isTop3
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

      {/* 📋 상위 3개 표기 */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">전력 소비 TOP 3</h3>
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-300 px-2 py-1">순위</th>
              <th className="border border-gray-300 px-2 py-1">요일</th>
              <th className="border border-gray-300 px-2 py-1">소비량 (kWh)</th>
            </tr>
          </thead>
          <tbody>
            {top3.map((item, idx) => {
              const rowStyle =
                idx === 0
                  ? "bg-red-100 text-black font-bold"
                  : "bg-orange-100 text-black font-semibold";
              return (
                <tr key={item.day} className={`border-t border-gray-300 ${rowStyle}`}>
                  <td className="px-2 py-1">{idx + 1}위</td>
                  <td className="px-2 py-1">{item.day}요일</td>
                  <td className="px-2 py-1">{item.power} kWh</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WeeklyChartComponent;
