// 📁 src/components/power/weeklyChart.jsx
import React, { useMemo } from "react";
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

/** 'YYYY-MM-DD' → Date (로컬/KST) */
const parseYMD = (s) => {
  if (!s) return null;
  const [y, m, d] = String(s).slice(0, 10).split("-").map((n) => parseInt(n, 10));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};
/** Date → 'YYYY-MM-DD' */
const toYMD = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

/** MM/DD 변환: 슬래시는 작게 (기존 라벨 스타일 유지) */
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
  const { monthlyData } = usePowerChart();

  // ✅ "진짜 최근 7일(캘린더 기준)"로 필터하되, 기존 TOP/표 구조 유지
  const { weekData, top3, top1Dates } = useMemo(() => {
    if (!monthlyData?.length)
      return { weekData: [], top3: [], top1Dates: [] };

    const latestStr = monthlyData[monthlyData.length - 1].date;
    const latestDt = parseYMD(latestStr);
    if (!latestDt) return { weekData: [], top3: [], top1Dates: [] };

    const from = new Date(
      latestDt.getFullYear(),
      latestDt.getMonth(),
      latestDt.getDate() - 6
    );
    const fromStr = toYMD(from);

    // 컨텍스트가 오름차순 정렬을 보장하므로 문자열 비교로 안전하게 범위 필터
    const picked = monthlyData.filter(
      (d) => d.date >= fromStr && d.date <= latestStr
    );

    // 기존 TOP3 계산/점 색 강조 로직 유지
    const sorted = [...picked].sort(
      (a, b) => (b?.power ?? 0) - (a?.power ?? 0)
    );
    const _top3 = sorted.slice(0, 3);
    const _top1Dates = sorted.slice(0, 1).map((d) => d.date);

    return { weekData: picked, top3: _top3, top1Dates: _top1Dates };
  }, [monthlyData]);

  // 기존 X축 라벨 렌더러 유지
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
            // ✅ 기존 도트 강조(Top1=빨강/Top3=주황/그 외=노랑) 유지
            dot={({ cx, cy, payload }) => {
              const isTop1 = top1Dates.includes(payload.date);
              const isTop3 = top3.find((t) => t.date === payload.date);
              const color = isTop1 ? "#ff4d4f" : isTop3 ? "#f97316" : "#facc15";
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

      {/* ✅ 기존 하단 TOP 표 유지 (tr 공백 노드 방지: 배열로 렌더) */}
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
          <tbody>
            {top3.map((item, idx) => {
              const rowStyle =
                idx === 0 ? "bg-red-100 text-black font-bold" : "bg-orange-100 text-black";
              const price =
                item?.price ?? Math.round((item?.power ?? 0) * 110); // 서버에 price 없으면 대략치
              return (
                <tr
                  key={item.date}
                  className={`border-t border-gray-300 ${rowStyle} text-center`}
                >
                  {[
                    <td key="rank" className="px-2 py-1 text-center">
                      {idx + 1}위
                    </td>,
                    <td key="date" className="px-2 py-1 text-center">
                      {item.date?.slice(5, 7)}
                      <span style={{ fontSize: "12px" }}>/</span>
                      {item.date?.slice(8, 10)}
                    </td>,
                    <td key="weekday" className="px-2 py-1 text-center">
                      {item.weekday ?? ""}
                    </td>,
                    <td key="power" className="px-2 py-1 text-center">
                      {item.power} kWh
                    </td>,
                    <td key="price" className="px-2 py-1 text-center">
                      {price.toLocaleString()} 원
                    </td>,
                  ]}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
