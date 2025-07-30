// 📁 src/apis/workSimulApi.js
// ✅ 설비별 작업시간 데이터 (샘플 vs 실서버 자동 전환)

import axios from "axios";

// ✅ 환경 변수에서 API 주소 불러오기
const BASE_URL = "https://api.sensor-tive.com"; // 실제 주소로 교체 필요

// ✅ 샘플 모드 여부
const isSampleMode = true;

/* ---------------------------------------------
 * ✅ 샘플 데이터 생성 함수
 * --------------------------------------------- */
function generateSampleWorkTimes() {
  return [
    { line: "라인1", start: "08:00", end: "20:00" },
    { line: "라인2", start: "09:00", end: "20:00" },
    { line: "라인3", start: "07:30", end: "18:00" },
  ];
}

/* ---------------------------------------------
 * ✅ 샘플 fetch 함수 (비동기처럼 사용)
 * --------------------------------------------- */
async function fetchWorkSimulSample() {
  return Promise.resolve(generateSampleWorkTimes());
}

/* ---------------------------------------------
 * ✅ 실제 API fetch 함수 (axios 사용)
 * --------------------------------------------- */
async function fetchWorkSimulReal() {
  const res = await axios.get(`${BASE_URL}/api/worksimul`);
  return res.data; // [{ line: '라인1', start: '08:00', end: '20:00' }, ...]
}

/* ---------------------------------------------
 * ✅ export (샘플 / 실서버 자동 전환)
 * --------------------------------------------- */
export const fetchWorkSimulData = isSampleMode
  ? fetchWorkSimulSample
  : fetchWorkSimulReal;
