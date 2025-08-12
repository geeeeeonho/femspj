// 📁 src/apis/workSimulApi.js
// ✅ 설비별 작업시간 데이터 (샘플 vs 실서버 자동 전환)

import { http, isSample } from "./http";

const useSample = isSample();

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
 * ✅ 실제 API fetch 함수
 * --------------------------------------------- */
async function fetchWorkSimulReal() {
  const res = await http.get("/api/worksimul");
  return res.data; // [{ line: '라인1', start: '08:00', end: '20:00' }, ...]
}

/* ---------------------------------------------
 * ✅ export (샘플 / 실서버 자동 전환)
 * --------------------------------------------- */
export const fetchWorkSimulData = useSample
  ? fetchWorkSimulSample
  : fetchWorkSimulReal;
