// 📁 src/components/power/monthlyChart.jsx
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { usePowerChart } from "../../contexts/powerChartContext"; // ← 리눅스 경로 수정

// 날짜의 "주차"(1~7=1주, 8~14=2주 …) 계산: 기존 로직 유지
function getWeekNumber(dateStr) {
  const day = parseInt(dateStr.slice(8, 10), 10);
  return Math.ceil(day / 7);
}

function MonthlyChartComponent() {
  const { monthlyData } = usePowerChart();

  // ✅ "이번 달이 데이터에 있으면 이번 달, 없으면 최신 달" + 주차 합계
  const { targetMonth, weeklyData, powerSorted } = useMemo(() => {
    if (!monthlyData?.length) return { targetMonth: "", weeklyData: [], powerSorted: [] };

    const today = new Date();
    const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    const months = Array.from(new Set(monthlyData.map((d) => d.date.slice(0, 7)))).sort();
    const latestMonth = months[months.length - 1];
    const target = months.includes(thisMonth) ? thisMonth : latestMonth;

    const monthData = monthlyData.filter((d) => d.date.slice(0, 7) === target);

    const weeklySummary = {};
    for (const item of monthData) {
      const week = getWeekNumber(item.date);
      if (!weeklySummary[week]) {
        weeklySummary[week] = { week: `${week}주차`, power: 0, price: 0 };
      }
      weeklySummary[week].power += Number(item.power) || 0;
      weeklySummary[week].price += Number(item.price) || 0;
    }

    const weeklyData = Object.values(weeklySummary).sort(
      (a, b) => parseInt(a.week) - parseInt(b.week)
    );

    // ✅ 소비량 기준 TOP 순위 (기존 표의 "소비 순위" 유지)
    const powerSorted = [...weeklyData]
      .sort((a, b) => b.power - a.power)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    return { targetMonth: target, weeklyData, powerSorted };
  }, [monthlyData]);

  return (
    <div className="bg-white p-4 pl-2 rounded shadow">
      <h2 className="font-bold mb-2">🟦 월간(주별 합계)</h2>
      <p className="text-sm text-gray-500 mb-2">대상 월: {targetMonth || "-"}</p>

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
          <Bar dataKey="power" fill="#60a5fa" name="소비량 (kWh)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* ✅ 기존 하단 "주간 소비량 순위" 표 유지 */}
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
              if (rank === 1) rowStyle = "bg-red-100 text-black font-bold";
              else if (rank === 2 || rank === 3) rowStyle = "bg-orange-100 text-black";

              return (
                <tr
                  key={item.week}
                  className={`border-t border-gray-300 text-center ${rowStyle}`}
                >
                  <td className="border px-2 py-1 text-center">{item.week}</td>
                  <td className="border px-2 py-1 text-center">{item.power} kWh</td>
                  <td className="border px-2 py-1 text-center">
                    {(item.price ?? 0).toLocaleString()} 원
                  </td>
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
