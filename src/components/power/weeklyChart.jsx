// 📄 파일: src/components/power/weeklyChart.jsx
// 📊 주간 전력 소비 차트

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "월", power: 240 },
  { day: "화", power: 260 },
  { day: "수", power: 210 },
  { day: "목", power: 280 },
  { day: "금", power: 310 },
  { day: "토", power: 260 },
  { day: "일", power: 220 },
];

function WeeklyChartComponent() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">✅ 주간 전력 소비</h2>
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
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeeklyChartComponent;
