// 📁 src/contexts/powerChartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { fetchMonthlyData } from "../apis/dayApi";

const PowerChartContext = createContext();

export const PowerChartProvider = ({ children }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalPower, setTotalPower] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchMonthlyData()
      .then((data) => {
        setMonthlyData(data);

        const totalP = data.reduce((sum, item) => sum + item.power, 0);
        const totalW = data.reduce((sum, item) => sum + item.price, 0);

        setTotalPower(totalP);
        setTotalPrice(totalW);
      })
      .catch((err) => {
        console.error("월별 데이터 로드 실패:", err);
      });
  }, []);

  return (
    <PowerChartContext.Provider value={{ monthlyData, totalPower, totalPrice }}>
      {children}
    </PowerChartContext.Provider>
  );
};

export const usePowerChart = () => useContext(PowerChartContext);
