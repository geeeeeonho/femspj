// 📁 src/apis/dayApi.js
import { http, isSample } from "./http";

/* =========================
 * 공용 유틸(주간 월간)
 * ========================= */

// 문자열·숫자 어떤 형식이 와도 Date로 바꿔주는 안전 함수
function toDateAny(input) {
  if (input == null) return null;

  // 이미 Date면 그대로
  if (input instanceof Date && !isNaN(input)) return input;

  // 숫자(초/밀리초) 또는 숫자 모양 문자열 처리
  if (typeof input === "number" || /^[0-9]+$/.test(String(input).trim())) {
    const num = Number(input);
    // 10자리면 초, 13자리면 밀리초로 판단
    const ms = String(num).length === 10 ? num * 1000 : num;
    const dt = new Date(ms);
    return isNaN(dt) ? null : dt;
  }

  // 문자열 일반화(슬래시/점 → 하이픈)
  const s = String(input).trim().replace(/[./]/g, "-");

  // ISO 포함 대부분의 형식 시도
  const dtIso = new Date(s);
  if (!isNaN(dtIso)) return dtIso;

  // YYYY-MM-DD 패턴만 뽑아 직접 조립
  const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) {
    const y = Number(m[1]), mo = Number(m[2]) - 1, d = Number(m[3]);
    const dt = new Date(y, mo, d); // 로컬(KST)
    return isNaN(dt) ? null : dt;
  }
  return null;
}

function toYMD(input) {
  const dt = toDateAny(input);
  if (!dt) return "";
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// "1,234.56" 같은 문자열도 1234.56으로 안전 변환
function toNumber(v) {
  if (typeof v === "string") v = v.replace(/,/g, "").trim();
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normalizeRow(r) {
  return {
    date: toYMD(r?.date),
    power: toNumber(r?.power),
    price: toNumber(r?.price),
  };
}

function sortByDateAsc(rows) {
  return rows
    .filter((r) => r.date) // 날짜 파싱 실패분 제거
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/* =========================
 * 샘플 데이터
 * ========================= */
const sampleRows = [
  { date: "2025-07-01", power: 12.3, price: 2450 },
  { date: "2025-07-02", power:  9.8, price: 1960 },
  { date: "2025-07-03", power: 11.1, price: 2220 },
  { date: "2025-07-04", power: 10.5, price: 2100 },
  { date: "2025-07-05", power: 13.0, price: 2600 },
  { date: "2025-07-06", power:  8.7, price: 1740 },
  { date: "2025-07-07", power: 14.2, price: 2840 },
  { date: "2025-07-08", power:  8.7, price: 1740 },
  { date: "2025-07-09", power:  8.7, price: 1740 },
  { date: "2025-07-10", power:  8.7, price: 1740 },
  { date: "2025-07-11", power:  8.7, price: 1740 },
  { date: "2025-07-12", power: 12.8, price: 2560 },
  { date: "2025-07-13", power: 13.6, price: 2720 },
  { date: "2025-07-14", power: 11.4, price: 2280 },
  { date: "2025-07-15", power: 10.9, price: 2180 },
  { date: "2025-07-16", power:  9.5, price: 1900 },
  { date: "2025-07-17", power: 12.1, price: 2420 },
  { date: "2025-07-18", power: 13.8, price: 2760 },
  { date: "2025-07-19", power: 14.5, price: 2900 },
  { date: "2025-07-20", power: 10.2, price: 2040 },
  { date: "2025-07-21", power: 11.7, price: 2340 },
  { date: "2025-07-22", power: 12.9, price: 2580 },
  { date: "2025-07-23", power:  9.2, price: 1840 },
  { date: "2025-07-24", power:  8.9, price: 1780 },
  { date: "2025-07-25", power: 13.3, price: 2660 },
  { date: "2025-07-26", power: 12.6, price: 2520 },
  { date: "2025-07-27", power: 14.0, price: 2800 },
  { date: "2025-07-28", power: 10.8, price: 2160 },
  { date: "2025-07-29", power: 11.5, price: 2300 },
  { date: "2025-07-30", power:  9.7, price: 1940 },
  { date: "2025-07-31", power: 13.1, price: 2620 },
];

/* =========================
 * 라이트 API: 일 단위
 * ========================= */
// 최근 N일 (기본 30일)
async function fetchDailyRecentSample(days = 30) {
  const arr = sortByDateAsc(sampleRows.map(normalizeRow));
  const end = arr[arr.length - 1]?.date;
  if (!end) return arr;
  const e = toDateAny(end);
  const s = new Date(e);
  s.setDate(s.getDate() - Math.abs(days) + 1);
  const startYmd = toYMD(s);
  return arr.filter((r) => r.date >= startYmd && r.date <= toYMD(e));
}

async function fetchDailyRecentReal(days = 30) {
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
  const { data } = await http.get(`/api/power-data/daily`, {
    params: { start: toYMD(startYmd), end: toYMD(endYmd) },
  });
  const rows = data?.rows || data?.data || data || [];
  return sortByDateAsc(rows.map(normalizeRow));
}

/* =========================
 * (구) 월간 API — 유지
 * ========================= */
async function fetchMonthlyDataSample() {
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
export function fetchDailyRecent(days = 30, useSampleFlag = isSample()) {
  return useSampleFlag ? fetchDailyRecentSample(days) : fetchDailyRecentReal(days);
}
export function fetchDailyRange(startYmd, endYmd, useSampleFlag = isSample()) {
  return useSampleFlag ? fetchDailyRangeSample(startYmd, endYmd) : fetchDailyRangeReal(startYmd, endYmd);
}
export function fetchMonthlyData(useSampleFlag = isSample()) {
  return useSampleFlag ? fetchMonthlyDataSample() : fetchMonthlyDataReal();
}
