// 📁 src/contexts/PowerChartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

// ✅ 월간 샘플 데이터 (1일부터 31일까지, power: 소비량, weekday: 요일)
const sampleMonthlyData = Array.from({ length: 31 }, (_, i) => {
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const day = i + 1;
  const date = day.toString().padStart(2, "0");
  return {
    date,
    weekday: weekdays[(i + 1) % 7], // 단순 요일 생성용 (샘플)
    power: Math.floor(180 + Math.random() * 150), // 180~330 사이 랜덤
  };
});

const PowerChartContext = createContext();

export const PowerChartProvider = ({ children }) => {
  const [weeklyStart, setWeeklyStart] = useState(null); // 주간 시작일
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // 📌 월간 데이터: 최초 1회 세팅
  useEffect(() => {
    // 🚫 서버 연동 예시 (샘플에서는 주석 처리)
    /*
    fetch('/api/power-data/monthly')
      .then(res => res.json())
      .then(data => setMonthlyData(data));
    */
    setMonthlyData(sampleMonthlyData);
  }, []);

  return (
    <PowerChartContext.Provider
      value={{
        weeklyStart,
        setWeeklyStart,
        weeklyData,
        setWeeklyData,
        monthlyData,
      }}
    >
      {children}
    </PowerChartContext.Provider>
  );
};

export const usePowerChart = () => useContext(PowerChartContext);
