import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { usePowerChart } from "../../contexts/PowerChartContext";

function getWeekNumber(dateStr) {
  const day = parseInt(dateStr.slice(8, 10), 10);
  return Math.ceil(day / 7);
}

function MonthlyChartComponent() {
  const { monthlyData } = usePowerChart();

  // 최신 월 데이터만 필터링
  let monthData = [];
  if (monthlyData.length > 0) {
    const lastMonth = monthlyData[monthlyData.length - 1].date.slice(0, 7);
    monthData = monthlyData.filter((d) => d.date.slice(0, 7) === lastMonth);
  }

  // 주차별 데이터 합산
  const weeklySummary = {};
  for (const item of monthData) {
    const week = getWeekNumber(item.date);
    if (!weeklySummary[week]) {
      weeklySummary[week] = { week: `${week}주차`, power: 0, price: 0 };
    }
    weeklySummary[week].power += item.power;
    weeklySummary[week].price += item.price ?? 0;
  }

  const weeklyData = Object.values(weeklySummary).sort(
    (a, b) => parseInt(a.week) - parseInt(b.week)
  );

  // ✅ 소비량 기준 TOP 3 계산
  const powerSorted = [...weeklyData]
    .sort((a, b) => b.power - a.power)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  return (
    <div className="bg-white p-4 pl-2 rounded shadow">
      <h2 className="font-bold mb-2">🟦 이번달 주간 전력 소비 (소비량 기준)</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={weeklyData}
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          barSize={28}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} kWh`, "소비량"]} />
          <Bar
            dataKey="power"
            fill="#60a5fa"
            name="소비량 (kWh)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* 📊 하단 표 */}
      <div className="mt-6 w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
        <h3 className="font-semibold mb-2">🔥 주간 소비량 순위</h3>
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border border-gray-300 px-2 py-1 text-center">주차</th>
              <th className="border border-gray-300 px-2 py-1 text-center">총 소비량</th>
              <th className="border border-gray-300 px-2 py-1 text-center">총 요금</th>
              <th className="border border-gray-300 px-2 py-1 text-center">소비 순위</th>
            </tr>
          </thead>
          <tbody>
            {weeklyData.map((item) => {
              const matched = powerSorted.find((p) => p.week === item.week);
              const rank = matched ? matched.rank : "-";

              let rowStyle = "";
              if (rank === 1)
                rowStyle = "bg-red-100 text-black font-bold";
              else if (rank === 2 || rank === 3)
                rowStyle = "bg-orange-100 text-black";

              return (
                <tr key={item.week} className={`border-t border-gray-300 text-center ${rowStyle}`}>
                  <td className="border px-2 py-1 text-center">{item.week}</td>
                  <td className="border px-2 py-1 text-center">{item.power} kWh</td>
                  <td className="border px-2 py-1 text-center">{item.price.toLocaleString()} 원</td>
                  <td className="border px-2 py-1 text-center">{rank}위</td>
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
