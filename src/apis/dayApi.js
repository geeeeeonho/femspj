// 📁 src/apis/dayApi.js
import { http, isSample } from "./http";

// ❌ 로컬 스위치 삭제
// const isSampleMode = true;

/* =========================
   샘플 데이터 (원하면 수정/삭제)
========================= */
const sampleRows = [
  { date: "2025-08-04", power: 12.3, price: 2450 },
  { date: "2025-08-05", power:  9.8, price: 1960 },
  { date: "2025-08-06", power: 11.1, price: 2220 },
  { date: "2025-08-07", power: 10.5, price: 2100 },
  { date: "2025-08-08", power: 13.0, price: 2600 },
  { date: "2025-08-09", power:  8.7, price: 1740 },
  { date: "2025-08-10", power: 14.2, price: 2840 },
];

async function fetchMonthlyDataSample() {
  return new Promise((resolve) => setTimeout(() => resolve(sampleRows), 200));
}

/* =========================
   실서버 호출
   백엔드 /api/power-data/monthly → { success:true, rows:[{date, power}] }
========================= */
async function fetchMonthlyDataReal() {
  const { data } = await http.get("/api/power-data/monthly");
  const rows = data?.rows || data?.data || data || [];
  return rows.map((r) => ({
    date: r.date,
    power: Number(r.power) || 0,
    price: Number(r.price ?? 0) || 0, // 서버에 price 없으면 0
  }));
}

/* =========================
   export
   - 인자를 안 주면 http.js의 isSample()을 기본값으로 사용
========================= */
export function fetchMonthlyData(useSampleFlag = isSample()) {
  return useSampleFlag ? fetchMonthlyDataSample() : fetchMonthlyDataReal();
}
