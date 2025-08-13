// 📁 src/apis/dayApi.js
import { http, isSample } from "./http";

/* =========================
 * 공용 유틸(주간 월간)
 * ========================= */
function toYMD(input) {
  if (!input) return "";
  const s = String(input).slice(0, 10).replace(/[./]/g, "-");
  const [y, m, d] = s.split("-");
  if (!y || !m || !d) return "";
  const mm = String(parseInt(m, 10)).padStart(2, "0");
  const dd = String(parseInt(d, 10)).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

function normalizeRow(r) {
  return {
    date: toYMD(r.date),
    power: Number(r.power) || 0,
    price: Number(r.price ?? 0) || 0,
  };
}

function sortByDateAsc(rows) {
  return rows
    .filter((r) => r.date)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/* =========================
 * 샘플 데이터 (원하면 수정/삭제)
 * ========================= */
const sampleRows = [
  { date: "2025-08-01", power: 12.3, price: 2450 },
  { date: "2025-08-02", power:  9.8, price: 1960 },
  { date: "2025-08-03", power: 11.1, price: 2220 },
  { date: "2025-08-04", power: 10.5, price: 2100 },
  { date: "2025-08-05", power: 13.0, price: 2600 },
  { date: "2025-08-06", power:  8.7, price: 1740 },
  { date: "2025-08-07", power: 14.2, price: 2840 },
];

/* =========================
 * 라이트 API: 일 단위 (대용량 인덱스 없음)
 * ========================= */
// 최근 N일 (기본 30일)
async function fetchDailyRecentSample(days = 30) {
  const arr = sortByDateAsc(sampleRows.map(normalizeRow));
  const end = arr[arr.length - 1]?.date;
  if (!end) return arr;
  const e = new Date(end);
  const s = new Date(e);
  s.setDate(s.getDate() - Math.abs(days) + 1);
  const startYmd = toYMD(s);
  return arr.filter((r) => r.date >= startYmd && r.date <= toYMD(e));
}

async function fetchDailyRecentReal(days = 30) {
  // 백엔드가 아래 쿼리 형태 지원한다고 가정: /api/power-data/daily?days=30
  const { data } = await http.get(`/api/power-data/daily`, { params: { days } });
  const rows = data?.rows || data?.data || data || [];
  return sortByDateAsc(rows.map(normalizeRow));
}

// 특정 기간 [start,end]
async function fetchDailyRangeSample(startYmd, endYmd) {
  const arr = sortByDateAsc(sampleRows.map(normalizeRow));
  const s = toYMD(startYmd);
  const e = toYMD(endYmd);
  return arr.filter((r) => r.date >= s && r.date <= e);
}

async function fetchDailyRangeReal(startYmd, endYmd) {
  // 백엔드가 아래 쿼리 형태 지원한다고 가정: /api/power-data/daily?start=YYYY-MM-DD&end=YYYY-MM-DD
  const { data } = await http.get(`/api/power-data/daily`, {
    params: { start: toYMD(startYmd), end: toYMD(endYmd) },
  });
  const rows = data?.rows || data?.data || data || [];
  return sortByDateAsc(rows.map(normalizeRow));
}

/* =========================
 * (구) 월간 API — 유지하되 deprecate
 * ========================= */
async function fetchMonthlyDataSample() {
  // 이전 코드와 동일
  return sortByDateAsc(sampleRows.map(normalizeRow));
}
async function fetchMonthlyDataReal() {
  const { data } = await http.get("/api/power-data/monthly");
  const rows = data?.rows || data?.data || data || [];
  return sortByDateAsc(rows.map(normalizeRow));
}

/* =========================
 * exports
 * ========================= */
// ✅ 권장: 최근 N일
export function fetchDailyRecent(days = 30, useSampleFlag = isSample()) {
  return useSampleFlag ? fetchDailyRecentSample(days) : fetchDailyRecentReal(days);
}
// ✅ 권장: 특정 구간
export function fetchDailyRange(startYmd, endYmd, useSampleFlag = isSample()) {
  return useSampleFlag
    ? fetchDailyRangeSample(startYmd, endYmd)
    : fetchDailyRangeReal(startYmd, endYmd);
}

// ⚠️ 호환용(이전 컴포넌트가 사용 중이면 그대로 두세요)
//    새 코드에서는 dayCustomApi(+context) 사용을 권장
export function fetchMonthlyData(useSampleFlag = isSample()) {
  return useSampleFlag ? fetchMonthlyDataSample() : fetchMonthlyDataReal();
}
