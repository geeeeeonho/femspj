// 📁 src/apis/livePriceApi.js
// 설명: 실시간 전력 요금 API (샘플 vs 실서버 자동 전환)

import { http, isSample } from "./http";

const useSample = isSample();

/* -------------------------------
 * ✅ 샘플 데이터 함수
 * ------------------------------- */
async function fetchLivePriceSample() {
  return {
    price: 23500,
    unit: "KRW",
    updatedAt: "2025-07-09T11:30:00+09:00",
  };
}

/* -------------------------------
 * ✅ 실제 API 함수
 * ------------------------------- */
async function fetchLivePriceReal() {
  const res = await http.get("/api/live/price");
  return res.data;
}

/* -------------------------------
 * ✅ export: 자동 분기
 * ------------------------------- */
export const fetchLivePrice = useSample
  ? fetchLivePriceSample
  : fetchLivePriceReal;
