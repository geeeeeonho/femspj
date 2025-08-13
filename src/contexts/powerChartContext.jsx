// 📁 src/contexts/powerChartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { fetchMonthlyData } from "../apis/dayApi";
import { useAuth } from "./authContext";

const PowerChartContext = createContext();

const WEEK_KO = ["일","월","화","수","목","금","토"];
function getKoreanWeekday(yyyy_mm_dd) {
  if (!yyyy_mm_dd) return "";
  const [y, m, d] = yyyy_mm_dd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);     // ✅ 로컬 타임존(Asia/Seoul) 안전
  return WEEK_KO[dt.getDay()];
}

export const PowerChartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalPower, setTotalPower] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) return;

    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    if (pathname.startsWith("/setting")) return;

    fetchMonthlyData()
      .then((data) => {
        const safe = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

        // ✅ 파생값 주입 (weekday) + 숫자 클린업 + price fallback(옵션)
        const enriched = safe.map((it) => {
          const power = Number(it?.power) || 0;
          const price = Number(it?.price ?? 0) || 0; // 필요시: || Math.round(power * 110)
          return {
            ...it,
            power,
            price,
            weekday: getKoreanWeekday(it?.date),
          };
        });

        setMonthlyData(enriched);
        setTotalPower(enriched.reduce((sum, it) => sum + it.power, 0));
        setTotalPrice(enriched.reduce((sum, it) => sum + it.price, 0));
      })
      .catch((err) => {
        console.error("월별 데이터 로드 실패:", err);
      });
  }, [isLoggedIn]);

  return (
    <PowerChartContext.Provider value={{ monthlyData, totalPower, totalPrice }}>
      {children}
    </PowerChartContext.Provider>
  );
};

export const usePowerChart = () => useContext(PowerChartContext);
