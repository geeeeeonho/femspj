import { createContext, useContext, useState, useEffect } from "react";
import { fetchMonthlyData } from "../apis/dayApi";

const PowerChartContext = createContext();

export const PowerChartProvider = ({ children }) => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    // 샘플데이터: true, 실제데이터: false
    fetchMonthlyData(true).then(setMonthlyData);
    // fetchMonthlyData(false).then(setMonthlyData);  // 실제 연동시
  }, []);

  return (
    <PowerChartContext.Provider value={{ monthlyData }}>
      {children}
    </PowerChartContext.Provider>
  );
};

export const usePowerChart = () => useContext(PowerChartContext);
