//앱 전체에서 접근 가능을 위한 전역 컨텍스트

import { createContext, useContext, useState, useEffect } from "react";
import { fetchPeakAlert } from "../apis/alertApi";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [isPeak, setIsPeak] = useState(false);
  const [peakTime, setPeakTime] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await fetchPeakAlert();
        setIsPeak(data.isPeak);
        setPeakTime(data.time);
      } catch (err) {
        console.error("⚠️ 피크 상태 불러오기 실패", err);
      }
    }, 5000); // 5초마다 체크

    return () => clearInterval(interval);
  }, []);

  return (
    <AlertContext.Provider value={{ isPeak, peakTime }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
