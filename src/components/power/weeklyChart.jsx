// 파일: src/components/power/weeklyChart.jsx

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

function WeeklyChartComponent() {
  const { monthlyData } = usePowerChart();

  // 최신 7일 기준으로 주간 데이터 생성
  const weekData = monthlyData.slice(-7);

  // 정렬 기준: 소비량 내림차순
  const sorted = [...weekData].sort((a, b) => b.power - a.power);
  const top1 = sorted.slice(0, 1).map((d) => d.date);
  const top3 = sorted.slice(0, 3);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">📆 주간 전력 소비 추이</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={weekData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => {
              const item = weekData.find((d) => d.date === v);
              return item ? `${item.weekday}(${v})` : `${v}일`;
            }}
          />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} kWh`, "소비량"]}
            labelFormatter={(label) => {
              const item = weekData.find((d) => d.date === label);
              return `${label}일 (${item?.weekday})`;
            }}
          />
          <Line
            type="monotone"
            dataKey="power"
            stroke="#8884d8"
            strokeWidth={2}
            dot={({ cx, cy, payload }) => {
              const isTop1 = top1.includes(payload.date);
              const isTop3 = top3.find((t) => t.date === payload.date);
              const color = isTop1
                ? "#ff4d4f"
                : isTop3
                ? "#f97316"
                : "#facc15";
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

      {/* 하단 표시: 상위 3개 표기 (반응형 폭 적용 & 가운데 정렬) */}
      <div className="mt-6 w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
        <h3 className="font-semibold mb-2">🔥 전력 소비 TOP 3</h3>
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border border-gray-300 px-2 py-1 text-center">순위</th>
              <th className="border border-gray-300 px-2 py-1 text-center">날짜</th>
              <th className="border border-gray-300 px-2 py-1 text-center">요일</th>
              <th className="border border-gray-300 px-2 py-1 text-center">소비량 (kWh)</th>
            </tr>
          </thead>
          <tbody>
            {top3.map((item, idx) => {
              const rowStyle =
                idx === 0
                  ? "bg-red-100 text-black font-bold"
                  : "bg-orange-100 text-black";
              return (
                <tr
                  key={item.date}
                  className={`border-t border-gray-300 ${rowStyle} text-center`}
                >
                  <td className="px-2 py-1 text-center">{idx + 1}위</td>
                  <td className="px-2 py-1 text-center">{item.date}일</td>
                  <td className="px-2 py-1 text-center">{item.weekday}</td>
                  <td className="px-2 py-1 text-center">{item.power} kWh</td>
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
