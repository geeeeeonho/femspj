import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { usePowerChart } from "../../contexts/powerChartContext";

// MM/DD 변환 함수, /는 2pt 작게
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

function WeeklyChartComponent() {
  const { monthlyData } = usePowerChart();

  // 최신 7일 기준으로 주간 데이터 생성
  const weekData = monthlyData.slice(-7);

  // 정렬 기준: 소비량 내림차순
  const sorted = [...weekData].sort((a, b) => b.power - a.power);
  const top1 = sorted.slice(0, 1).map((d) => d.date);
  const top3 = sorted.slice(0, 3);

  // X축 라벨 렌더링
  const renderTick = ({ x, y, index }) => {
    const total = weekData.length;
    let offsetX = 0;
    if (index === total - 1) offsetX = -10;
    const d = weekData[index];
    return (
      <g transform={`translate(${x + offsetX},${y + 12})`}>
        <text
          x={0}
          y={0}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-gray-700 text-sm"
        >
          {MMDDwithSmallSlash(d?.date)}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">📆 최근 7일 전력 소비 추이</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={weekData}
          margin={{ top: 10, right: 25, left: 18, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            interval={0}
            tick={renderTick}
            tickLine={false}
            axisLine={{ stroke: "#aaa" }}
          />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} kWh`, "소비량"]}
            labelFormatter={(label) => {
              const item = weekData.find((d) => d.date === label);
              const mm = label?.slice(5, 7);
              const dd = label?.slice(8, 10);
              return `${item?.weekday ?? ""} (${mm}/${dd})`;
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

      {/* 📊 하단 표 */}
      <div className="mt-6 w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
        <h3 className="font-semibold mb-2">🔥 전력 소비 TOP 3</h3>
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border border-gray-300 px-2 py-1 text-center">순위</th>
              <th className="border border-gray-300 px-2 py-1 text-center">날짜</th>
              <th className="border border-gray-300 px-2 py-1 text-center">요일</th>
              <th className="border border-gray-300 px-2 py-1 text-center">소비량 (kWh)</th>
              <th className="border border-gray-300 px-2 py-1 text-center">요금</th> {/* ✅ 추가 */}
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
                  <td className="px-2 py-1 text-center">
                    {item.date.slice(5, 7)}
                    <span style={{ fontSize: "12px" }}>/</span>
                    {item.date.slice(8, 10)}
                  </td>
                  <td className="px-2 py-1 text-center">{item.weekday}</td>
                  <td className="px-2 py-1 text-center">{item.power} kWh</td>
                  <td className="px-2 py-1 text-center">{item.price.toLocaleString()} 원</td> {/* ✅ 추가 */}
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
