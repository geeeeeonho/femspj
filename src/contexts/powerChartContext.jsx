// 📁 src/contexts/powerChartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { fetchMonthlyData } from "../apis/dayApi";
import { useAuth } from "./authContext";
import { useLocation } from "react-router-dom";

const PowerChartContext = createContext();

export const PowerChartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();

  const [monthlyData, setMonthlyData] = useState([]);
  const [totalPower, setTotalPower] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (pathname.startsWith("/setting")) return; // ✅ 세팅 페이지에서는 로드 중단

    fetchMonthlyData(false) // 실서버
      .then((data) => {
        setMonthlyData(data);
        const totalP = data.reduce((sum, item) => sum + (item.power || 0), 0);
        const totalW = data.reduce((sum, item) => sum + (item.price || 0), 0);
        setTotalPower(totalP);
        setTotalPrice(totalW);
      })
      .catch((err) => {
        console.error("월별 데이터 로드 실패:", err);
      });
  }, [isLoggedIn, pathname]);

  return (
    <PowerChartContext.Provider value={{ monthlyData, totalPower, totalPrice }}>
      {children}
    </PowerChartContext.Provider>
  );
};

export const usePowerChart = () => useContext(PowerChartContext);
