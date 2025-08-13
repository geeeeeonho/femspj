// 📁 src/apis/dayApi.js
import { http, isSample } from "./http";

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
 * 날짜 정규화
 * ========================= */
function toYMD(input) {
  if (!input) return "";
  const s = String(input).slice(0, 10).replace(/[./]/g, "-"); // ISO/슬래시/닷 → '-'
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

/* =========================
 * 정렬(오래된 → 최신)
 * ========================= */
function sortByDateAsc(rows) {
  return rows
    .filter((r) => r.date)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/* =========================
 * 샘플 / 실제 API
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
 * export
 * ========================= */
export function fetchMonthlyData(useSampleFlag = isSample()) {
  return useSampleFlag ? fetchMonthlyDataSample() : fetchMonthlyDataReal();
}
