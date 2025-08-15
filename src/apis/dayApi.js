// 📁 src/apis/dayApi.js
import { http, isSample } from "./http";

/* =========================
 * 공용 유틸(주간/월간 공통)
 * ========================= */

// (원본)
function toDateAny(input) {
  if (input == null) return null;

  if (input instanceof Date && !isNaN(input)) return input;

  if (typeof input === "number" || /^[0-9]+$/.test(String(input).trim())) {
    const num = Number(input);
    const ms = String(num).length === 10 ? num * 1000 : num;
    const dt = new Date(ms);
    return isNaN(dt) ? null : dt;
  }

  const s = String(input).trim().replace(/[./]/g, "-");
  const dtIso = new Date(s);
  if (!isNaN(dtIso)) return dtIso;

  const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) {
    const y = Number(m[1]), mo = Number(m[2]) - 1, d = Number(m[3]);
    const dt = new Date(y, mo, d);
    return isNaN(dt) ? null : dt;
  }
  return null;
}

// (원본)
function toYMD(input) {
  const dt = toDateAny(input);
  if (!dt) return "";
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// (원본)
function toNumber(v) {
  if (typeof v === "string") v = v.replace(/,/g, "").trim();
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

// (원본)
function normalizeRow(r) {
  return {
    date: toYMD(r?.date),
    power: toNumber(r?.power),
    price: toNumber(r?.price),
  };
}

// (원본)
function sortByDateAsc(rows) {
  return rows
    .filter((r) => r.date)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/* =========================
 * 샘플 데이터 (원본 그대로)
 * ========================= */
const sampleRows = [
  { date: "2025-07-01", power: 12.3, price: 2450 },
  { date: "2025-07-02", power:  9.8, price: 1960 },
  { date: "2025-07-03", power: 11.1, price: 2220 },
  { date: "2025-07-04", power: 10.5, price: 2100 },
  { date: "2025-07-05", power: 13.0, price: 2600 },
  { date: "2025-07-06", power:  8.7, price: 1740 },
  { date: "2025-07-07", power: 14.2, price: 2840 },
  // ... (중략: 원본 유지)
];

/* =========================
 * 주간/월간 API (백엔드에 맞춰 보강)
 * ========================= */

// (원본) async function fetchDailyRecentReal(days = 30) { const { data } = await http.get(`/api/power-data/daily`, { params: { days } }); const rows = data?.rows || data?.data || data || []; return sortByDateAsc(rows.map(normalizeRow)); }
// └ 주간/월간 화면에서 실제로 쓰는 건 “주간/월간”이라, 백엔드 powerData.cjs에 맞게 weekly/monthly 엔드포인트로 조정
// 수정됨: 주간 데이터
async function fetchWeeklyDataReal() {
  const { data } = await http.get("/api/power-data/weekly");
  const rows = Array.isArray(data?.rows) ? data.rows
             : Array.isArray(data?.data) ? data.data
             : Array.isArray(data) ? data
             : []; // 배열 보장
  return sortByDateAsc(rows.map(normalizeRow));
}

// (원본) async function fetchMonthlyDataReal() { const { data } = await http.get("/api/power-data/monthly"); const rows = data?.rows || data?.data || data || []; return sortByDateAsc(rows.map(normalizeRow)); }
// 수정됨: 월간도 동일하게 배열 보장
async function fetchMonthlyDataReal() {
  const { data } = await http.get("/api/power-data/monthly");
  const rows = Array.isArray(data?.rows) ? data.rows
             : Array.isArray(data?.data) ? data.data
             : Array.isArray(data) ? data
             : [];
  return sortByDateAsc(rows.map(normalizeRow));
}

// (원본) async function fetchDailyRecentSample(days = 30) { ... 주간 대체용 샘플 생성 불필요 → 간단히 전체를 주차로 나누지 않고 원본 배열 반환 }
// 수정됨: 샘플 모드 – 간단히 날짜순 정렬만
async function fetchWeeklyDataSample() {
  return sortByDateAsc(sampleRows.map(normalizeRow));
}

// (원본) async function fetchMonthlyDataSample() { return sortByDateAsc(sampleRows.map(normalizeRow)); }  ← 유지
async function fetchMonthlyDataSample() {
  return sortByDateAsc(sampleRows.map(normalizeRow));
}

/* =========================
 * exports
 * ========================= */

// (원본) export function fetchDailyRecent(...)  ← 주간 화면에서 사용 시 의미 혼선
// 수정됨: 명시적으로 주간/월간 이름으로 export
export function fetchWeeklyData(useSampleFlag = isSample()) {
  return useSampleFlag ? fetchWeeklyDataSample() : fetchWeeklyDataReal();
}

export function fetchMonthlyData(useSampleFlag = isSample()) {
  return useSampleFlag ? fetchMonthlyDataSample() : fetchMonthlyDataReal();
}
