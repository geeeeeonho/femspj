// 📁 src/contexts/powerChartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { fetchMonthlyData } from "../apis/dayApi";
import { useAuth } from "./authContext";

/* 날짜/요일 유틸 */
const WEEK_KO = ["일", "월", "화", "수", "목", "금", "토"];

function toYMD(input) {
  if (!input) return "";
  const s = String(input).slice(0, 10).replace(/[./]/g, "-");
  const [y, m, d] = s.split("-");
  if (!y || !m || !d) return "";
  const mm = String(parseInt(m, 10)).padStart(2, "0");
  const dd = String(parseInt(d, 10)).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

function getKoreanWeekday(v) {
  const s = toYMD(v);
  if (!s) return "";
  const [y, m, d] = s.split("-").map((x) => parseInt(x, 10));
  if (!y || !m || !d) return "";
  const dt = new Date(y, m - 1, d); // 로컬(KST)
  return WEEK_KO[dt.getDay()];
}

export const PowerChartContext = createContext(null);

export function PowerChartProvider({ children }) {
  const { isLoggedIn } = useAuth?.() ?? { isLoggedIn: true };
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalPower, setTotalPower] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (isLoggedIn === false) {
      setMonthlyData([]);
      setTotalPower(0);
      setTotalPrice(0);
      return;
    }
    fetchMonthlyData()
      .then((rows) => {
        const safe = Array.isArray(rows)
          ? rows
          : Array.isArray(rows?.data)
          ? rows.data
          : [];

        // 날짜 정규화 + 요일 파생
        const enriched = safe.map((r) => {
          const date = toYMD(r?.date);
          const power = Number(r?.power) || 0;
          const price = Number(r?.price ?? 0) || 0;
          return { ...r, date, power, price, weekday: getKoreanWeekday(date) };
        });

        // 같은 날짜 중복 시 마지막 레코드 우선
        const byDate = new Map();
        for (const it of enriched) if (it.date) byDate.set(it.date, it);
        const deduped = Array.from(byDate.values());

        // 최종 정렬(오래된 → 최신)
        const sorted = deduped.sort((a, b) =>
          a.date < b.date ? -1 : a.date > b.date ? 1 : 0
        );

        setMonthlyData(sorted);
        setTotalPower(sorted.reduce((acc, it) => acc + it.power, 0));
        setTotalPrice(sorted.reduce((acc, it) => acc + it.price, 0));
      })
      .catch((err) => {
        console.error("월별 데이터 로드 실패:", err);
        setMonthlyData([]);
        setTotalPower(0);
        setTotalPrice(0);
      });
  }, [isLoggedIn]);

  return (
    <PowerChartContext.Provider
      value={{
        monthlyData,
        totalPower,
        totalPrice,
      }}
    >
      {children}
    </PowerChartContext.Provider>
  );
}

export function usePowerChart() {
  const ctx = useContext(PowerChartContext);
  if (!ctx) throw new Error("usePowerChart must be used within PowerChartProvider");
  return ctx;
}

export default PowerChartProvider;
