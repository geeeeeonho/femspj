// 📁 src/apis/dayApi.js
import { http, isSample } from "./http";

/* =========================
 * 샘플 데이터 (원하면 수정/삭제)
 * ========================= */
const sampleRows = [
  { date: "2025-08-04", power: 12.3, price: 2450 },
  { date: "2025-08-05", power:  9.8, price: 1960 },
  { date: "2025-08-06", power: 11.1, price: 2220 },
  { date: "2025-08-07", power: 10.5, price: 2100 },
  { date: "2025-08-08", power: 13.0, price: 2600 },
  { date: "2025-08-09", power:  8.7, price: 1740 },
  { date: "2025-08-10", power: 14.2, price: 2840 },
];

/* =========================
 * 날짜 문자열 → YYYY-MM-DD 정규화
 *  - '2025-08-04T00:00:00Z' → '2025-08-04'
 *  - '2025/08/04' → '2025-08-04'
 *  - '2025.08.04' → '2025-08-04'
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

/* =========================
 * 샘플 / 실제 API
 * ========================= */
async function fetchMonthlyDataSample() {
  // 딜레이가 필요하면 setTimeout 래핑해서 사용 가능
  return sampleRows.map(normalizeRow);
}

async function fetchMonthlyDataReal() {
  // 백엔드 응답 형태가 rows/data 등으로 다를 수 있어 안전 분기
  const { data } = await http.get("/api/power-data/monthly");
  const rows = data?.rows || data?.data || data || [];
  return rows.map(normalizeRow);
}

/* =========================
 * export
 * - 인자를 안 주면 http.js의 isSample()을 기본값으로 사용
 * ========================= */
export function fetchMonthlyData(useSampleFlag = isSample()) {
  return useSampleFlag ? fetchMonthlyDataSample() : fetchMonthlyDataReal();
}
