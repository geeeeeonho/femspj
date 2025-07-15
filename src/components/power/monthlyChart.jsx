// 파일: src/components/power/monthlyChart.jsx

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

// 날짜 MM/DD, /는 2pt 작게(12px)
function MMDDwithSmallSlash(dateStr) {
  if (!dateStr || dateStr.length < 10) return dateStr;
  const mm = dateStr.slice(5, 7);
  const dd = dateStr.slice(8, 10);
  return (
    <>
      {mm}
      <tspan style={{ fontSize: "12px" }}>/</tspan>
      {dd}
    </>
  );
}

function MonthlyChartComponent() {
  const { monthlyData } = usePowerChart();

  // **최신 월 데이터만 추출**
  let monthData = [];
  if (monthlyData.length > 0) {
    const lastMonth = monthlyData[monthlyData.length - 1].date.slice(0, 7); // "YYYY-MM"
    monthData = monthlyData.filter(d => d.date.slice(0, 7) === lastMonth);
  }

  const sorted = [...monthData].sort((a, b) => b.power - a.power);
  const top3 = sorted.slice(0, 3).map(d => d.date);
  const top7 = sorted.slice(0, 7);

  return (
    <div className="bg-white p-4 pl-2 rounded shadow">
      <h2 className="font-bold mb-2">🟦 최근 월간 전력 소비 추이</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={monthData}
          margin={{ top: 10, right: 36, left: 18, bottom: 0 }} // ✅ 오른쪽 여백 넉넉!
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            interval={1}
            tick={({ x, y, payload }) => (
              <g transform={`translate(${x},${y + 12})`}>
                <text
                  x={0}
                  y={0}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-gray-700 text-sm"
                >
                  {MMDDwithSmallSlash(payload.value)}
                </text>
              </g>
            )}
            tickLine={false}
            axisLine={{ stroke: "#aaa" }}
          />
          <YAxis />
          <Tooltip
            formatter={value => [`${value} kWh`, "소비량"]}
            labelFormatter={label => {
              const item = monthData.find(d => d.date === label);
              return (
                <>
                  {MMDDwithSmallSlash(label)}
                  {item?.weekday && ` (${item.weekday})`}
                </>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="power"
            stroke="#8884d8"
            strokeWidth={2}
            dot={({ cx, cy, payload }) => {
              const isTop3 = top3.includes(payload.date);
              const isTop7 = top7.find(d => d.date === payload.date);
              const color = isTop3
                ? "#ff4d4f"
                : isTop7
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
                  <td className="border px-2 py-1 text-center">
                    {MMDDwithSmallSlash(item.date)}
                  </td>
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
