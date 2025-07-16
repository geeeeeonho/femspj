import { createContext, useContext, useState, useEffect } from "react";
import { fetchMonthlyData } from "../apis/dayApi";

const PowerChartContext = createContext();

export const PowerChartProvider = ({ children }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalPower, setTotalPower] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // 샘플데이터: true, 실제데이터: false
    fetchMonthlyData(true).then((data) => {
      setMonthlyData(data);

      const totalP = data.reduce((sum, item) => sum + item.power, 0);
      const totalW = data.reduce((sum, item) => sum + item.price, 0);

      setTotalPower(totalP);
      setTotalPrice(totalW);
    });

    // fetchMonthlyData(false).then(...)  // 실제 연동 시 사용
  }, []);

  return (
    <PowerChartContext.Provider
      value={{ monthlyData, totalPower, totalPrice }}
    >
      {children}
    </PowerChartContext.Provider>
  );
};

export const usePowerChart = () => useContext(PowerChartContext);
