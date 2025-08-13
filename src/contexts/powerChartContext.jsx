import { createContext, useContext, useState, useEffect } from "react";
import { fetchMonthlyData } from "../apis/dayApi"; // ← 리눅스 대소문자/경로 주의
import { useAuth } from "./authContext";

const PowerChartContext = createContext();

/* =========================
 * 날짜/요일 유틸
 * ========================= */
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
  const dt = new Date(y, m - 1, d); // Asia/Seoul 로컬 기준
  return WEEK_KO[dt.getDay()];
}

/* =========================
 * Provider
 * ========================= */
export const PowerChartProvider = ({ children }) => {
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

        // ✅ 날짜 정규화 + 파생값 주입(weekday)
        const enriched = safe.map((r) => {
          const date = toYMD(r?.date);
          const power = Number(r?.power) || 0;
          const price = Number(r?.price ?? 0) || 0;
          return {
            ...r,
            date,
            power,
            price,
            weekday: getKoreanWeekday(date), // ← 요일 필드 주입
          };
        });

        setMonthlyData(enriched);
        setTotalPower(enriched.reduce((acc, it) => acc + it.power, 0));
        setTotalPrice(enriched.reduce((acc, it) => acc + it.price, 0));
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
};

export const usePowerChart = () => useContext(PowerChartContext);
