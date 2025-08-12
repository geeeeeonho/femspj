import { createContext, useContext, useState, useEffect } from "react";
import { fetchMonthlyData } from "../apis/dayApi";
import { useAuth } from "./authContext";

const PowerChartContext = createContext();

export const PowerChartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();

  const [monthlyData, setMonthlyData] = useState([]);
  const [totalPower, setTotalPower] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) return;

    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    if (pathname.startsWith("/setting")) return;

    // ⚠️ fetchMonthlyData 시그니처 확인: 인자 없는 버전이면 인자 제거
    fetchMonthlyData() 
      .then((data) => {
        const safe = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        const totalP = safe.reduce((sum, it) => sum + (Number(it?.power) || 0), 0);
        const totalW = safe.reduce((sum, it) => sum + (Number(it?.price) || 0), 0);
        setMonthlyData(safe);
        setTotalPower(totalP);
        setTotalPrice(totalW);
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
