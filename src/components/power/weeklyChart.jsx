// 📁 src/components/power/weeklyChart.jsx
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

/** MM/DD 변환: 슬래시는 작게 */
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

export default function WeeklyChartComponent() {
  // 컨텍스트 안전 가드 (SSR/Hydration 중 undefined 방지)
  const ctx = usePowerChart();
  const monthlyData = Array.isArray(ctx?.monthlyData) ? ctx.monthlyData : [];

  // 최신 7일
  const weekData = monthlyData.slice(-7);

  // TOP3 계산
  const sorted = [...weekData].sort((a, b) => (b?.power ?? 0) - (a?.power ?? 0));
  const top1Dates = sorted.slice(0, 1).map((d) => d.date);
  const top3 = sorted.slice(0, 3);

  // X축 라벨
  const renderTick = ({ x, y, index }) => {
    const d = weekData[index];
    const total = weekData.length;
    const offsetX = index === total - 1 ? -10 : 0;
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
        <LineChart data={weekData} margin={{ top: 10, right: 25, left: 18, bottom: 0 }}>
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
              const isTop1 = top1Dates.includes(payload.date);
              const isTop3 = top3.find((t) => t.date === payload.date);
              const color = isTop1 ? "#ff4d4f" : isTop3 ? "#f97316" : "#facc15";
              return (
                <circle cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={1} />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* 📊 하단 표 (tr 자식에 공백 텍스트 노드가 끼지 않도록 배열로 렌더링) */}
      <div className="mt-6 w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
        <h3 className="font-semibold mb-2">🔥 전력 소비 TOP 3</h3>
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-center">
              {["순위", "날짜", "요일", "소비량 (kWh)", "요금"].map((h) => (
                <th key={h} className="border border-gray-300 px-2 py-1 text-center">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{top3.map((item, idx) => {
            const rowStyle = idx === 0 ? "bg-red-100 text-black font-bold" : "bg-orange-100 text-black";
            const price = item?.price ?? Math.round((item?.power ?? 0) * 110);
            return (
              <tr key={item.date} className={`border-t border-gray-300 ${rowStyle} text-center`}>
                {[
                  <td key="rank" className="px-2 py-1 text-center">{idx + 1}위</td>,
                  <td key="date" className="px-2 py-1 text-center">
                    {item.date?.slice(5, 7)}
                    <span style={{ fontSize: "12px" }}>/</span>
                    {item.date?.slice(8, 10)}
                  </td>,
                  <td key="weekday" className="px-2 py-1 text-center">{item.weekday ?? ""}</td>,
                  <td key="power" className="px-2 py-1 text-center">{item.power} kWh</td>,
                  <td key="price" className="px-2 py-1 text-center">{price.toLocaleString()} 원</td>,
                ]}
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
}
