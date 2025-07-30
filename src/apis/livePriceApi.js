// 📁 src/apis/livePriceApi.js
// 설명: 실시간 전력 요금 API (샘플 vs 실서버 자동 전환)

import axios from "axios";

// ✅ 환경 변수에서 API 주소 불러오기
const BASE_URL = 'https://api.sensor-tive.com';

// ✅ 샘플 모드 설정
const isSampleMode = true;

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
  const res = await axios.get(`${BASE_URL}/api/live/price`);
  return res.data;
}

/* -------------------------------
 * ✅ export: 자동 분기
 * ------------------------------- */
export const fetchLivePrice = isSampleMode ? fetchLivePriceSample : fetchLivePriceReal;
