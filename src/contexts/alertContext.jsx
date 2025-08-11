// 📁 src/contexts/alertContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { fetchPeakAlert } from "../apis/alertApi";
import { useAlertMailService } from "../services/alertMail";
import { useAuth } from "./authContext";
import { useLocation } from "react-router-dom";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();

  const [isPeak, setIsPeak] = useState(false);
  const [peakTime, setPeakTime] = useState(null);
  const [latestAlert, setLatestAlert] = useState(null);

  const { sendAlertIfNeeded } = useAlertMailService();

  useEffect(() => {
    if (!isLoggedIn) return;
    if (pathname.startsWith("/setting")) return; // ✅ 세팅 페이지에서는 폴링 중단

    let mounted = true;

    const load = async () => {
      try {
        const data = await fetchPeakAlert({ topN: 4 });
        if (!mounted) return;

        setIsPeak(!!data.isPeak);
        setPeakTime(data.time ?? null);
        setLatestAlert(data);

        await sendAlertIfNeeded(data);
      } catch (err) {
        console.error("⚠️ 피크 상태 불러오기 실패", err);
      }
    };

    load();
    const interval = setInterval(load, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [isLoggedIn, pathname, sendAlertIfNeeded]);

  return (
    <AlertContext.Provider value={{ isPeak, peakTime, latestAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
