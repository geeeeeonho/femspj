// 📁 src/apis/monthlyPowerApi.js
// ✅ 월별 전력 사용량 데이터 (샘플 vs 실서버 자동 전환)

import axios from "axios";

// ✅ 환경 변수에서 API 주소 불러오기
const BASE_URL = 'https://api.sensor-tive.com';

// ✅ 샘플 모드 여부
const isSampleMode = true;

/* ---------------------------------------------
 * ✅ 공통: 요일 자동 계산 (한글)
 * --------------------------------------------- */
function getKoreanWeekday(dateString) {
  const dayIndex = new Date(dateString).getDay();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return weekdays[dayIndex];
}

/* ---------------------------------------------
 * ✅ 샘플 데이터 생성 함수
 * --------------------------------------------- */
function generateSampleMonthlyData() {
  const data = [];
  const start = new Date("2024-07-01");
  const end = new Date("2025-06-30");
  let date = new Date(start);

  while (date <= end) {
    const isoDate = date.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const power = Math.floor(180 + Math.random() * 150); // kWh
    const price = parseFloat((power * (100 + Math.random() * 20)).toFixed(2)); // 단가 100~120원

    data.push({
      date: isoDate,
      power,
      price,
      weekday: getKoreanWeekday(isoDate),
    });

    date.setDate(date.getDate() + 1);
  }

  return data;
}

/* ---------------------------------------------
 * ✅ 샘플 fetch 함수 (비동기처럼 사용)
 * --------------------------------------------- */
async function fetchMonthlyDataSample() {
  return Promise.resolve(generateSampleMonthlyData());
}

/* ---------------------------------------------
 * ✅ 실제 API fetch 함수 (axios 사용)
 * --------------------------------------------- */
async function fetchMonthlyDataReal() {
  const res = await axios.get(`${BASE_URL}/api/power-data/monthly`);
  const data = res.data;

  return data.map((item) => ({
    ...item,
    weekday: item.weekday || getKoreanWeekday(item.date),
    price: item.price || Math.round(item.power * 110),
  }));
}

/* ---------------------------------------------
 * ✅ export (샘플 / 실서버 자동 전환)
 * --------------------------------------------- */
export const fetchMonthlyData = isSampleMode
  ? fetchMonthlyDataSample
  : fetchMonthlyDataReal;
