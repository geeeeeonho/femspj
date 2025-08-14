// 📁 src/components/power/monthlyChart.jsx
import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { usePowerChart } from "../../contexts/powerChartContext"; // 경로/대소문자 주의

/* ================================
 * 달 기준 주 묶기 (월요일 시작)
 * - 주 경계는 달력 주를 따르되, 합계는 그 달 날짜만 포함
 * ================================ */
const WEEK_START = 1; // 1=월요일, 0=일요일
const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * ONE_DAY;

function startOfWeek(date, weekStartsOn = WEEK_START) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dow = d.getDay();
  const diff = (dow - weekStartsOn + 7) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// 해당 달 안에서의 "주차" (1부터 시작)
function getMonthWeekIndex(ymd, weekStartsOn = WEEK_START) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const first = new Date(y, m - 1, 1);
  const w0 = startOfWeek(first, weekStartsOn);
  const wN = startOfWeek(dt, weekStartsOn);
  return Math.floor((wN - w0) / ONE_WEEK) + 1; // 1..(4~6)
}

// 그 달의 주 개수 (4~6주)
function getWeeksInMonthCalendar(yyyymm, weekStartsOn = WEEK_START) {
  const [y, m] = yyyymm.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const last = new Date(y, m, 0);
  const w0 = startOfWeek(first, weekStartsOn);
  const wEnd = startOfWeek(last, weekStartsOn);
  return Math.floor((wEnd - w0) / ONE_WEEK) + 1;
}

function round1(n) {
  return Math.round((Number(n) + Number.EPSILON) * 10) / 10;
}

function MonthlyChartComponent() {
  const { monthlyData } = usePowerChart();

  const { targetMonth, weeklyData, powerSorted } = useMemo(() => {
    if (!monthlyData?.length) return { targetMonth: "", weeklyData: [], powerSorted: [] };

    // 📌 집계할 달 (필요 시 선택값으로 바꿔도 됨)
    const months = Array.from(new Set(monthlyData.map(d => d.date.slice(0, 7)))).sort();
    const target = months.at(-1);

    // 해당 달 데이터만 사용 → 다른 달 날짜는 합계 제외
    const monthRows = monthlyData.filter(d => d.date.slice(0, 7) === target);

    // 주별 합계 (달력 주 기준)
    const bucket = {};
    for (const r of monthRows) {
      const wk = getMonthWeekIndex(r.date);
      if (!bucket[wk]) bucket[wk] = { week: `${wk}주차`, power: 0, price: 0 };
      bucket[wk].power += Number(r.power) || 0;
      bucket[wk].price += Number(r.price) || 0;
    }

    // 비어있는 주도 0으로 채우기 (4~6주)
    const weeks = getWeeksInMonthCalendar(target);
    const filled = [];
    for (let w = 1; w <= weeks; w++) {
      const row = bucket[w] ?? { week: `${w}주차`, power: 0, price: 0 };
      filled.push({ ...row, power: round1(row.power) });
    }

    const sorted = [...filled].sort((a, b) => b.power - a.power)
      .map((r, i) => ({ ...r, rank: i + 1 }));

    return { targetMonth: target, weeklyData: filled, powerSorted: sorted };
  }, [monthlyData]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">🟦 월간(주별 합계)</h2>
      <p className="text-sm text-gray-500 mb-3">대상 월: {targetMonth || "-"}</p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip formatter={(v) => [`${v} kWh`, "소비량"]} />
          <Bar dataKey="power" fill="#60a5fa" name="소비량 (kWh)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 max-w-2xl mx-auto">
        <h3 className="font-semibold mb-2">🔥 주간 소비량 순위</h3>
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border px-2 py-1">주차</th>
              <th className="border px-2 py-1">총 소비량</th>
              <th className="border px-2 py-1">총 요금</th>
              <th className="border px-2 py-1">소비 순위</th>
            </tr>
          </thead>
          <tbody>
            {weeklyData.map((r) => {
              const rank = powerSorted.find(p => p.week === r.week)?.rank ?? "-";
              const rowStyle =
                rank === 1 ? "bg-red-100 font-bold" :
                (rank === 2 || rank === 3) ? "bg-orange-100" : "";
              return (
                <tr key={r.week} className={`${rowStyle} text-center`}>
                  <td className="border px-2 py-1">{r.week}</td>
                  <td className="border px-2 py-1">{r.power.toFixed(1)} kWh</td>
                  <td className="border px-2 py-1">{(r.price ?? 0).toLocaleString()} 원</td>
                  <td className="border px-2 py-1">{rank}위</td>
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
