// 📁 src/apis/dayCustomApi.js
// 설명: 선택 구간(시작~종료) 분석에 사용되는 “일(day)” 데이터 인덱서
import { http, isSample } from "./http";

/* =========================
 * 내부 상태 (원본 유지)
 * ========================= */
let _ready = false;
let _dateKeys = [];
let _rows = [];
let _posByKey = new Map();

/* =========================
 * 유틸 (원본 유지)
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
function keyFromYmd(ymd) { return parseInt(ymd.replace(/-/g, ""), 10); }
function normalizeRow(r) {
  const date = toYMD(r.date);
  return {
    date,
    power: Number(r.power) || 0,
    price: Number(r.price ?? 0) || 0,
    _key: date ? keyFromYmd(date) : NaN,
  };
}

/* =========================
 * 인덱스 빌드/리셋 (원본 유지)
 * ========================= */
function buildIndex(rawRows) {
  const normalized = rawRows.map(normalizeRow).filter((r) => r.date && Number.isFinite(r._key));
  normalized.sort((a, b) => a._key - b._key);

  const dedup = [];
  for (let i = 0; i < normalized.length; i++) {
    if (i > 0 && normalized[i]._key === normalized[i - 1]._key) {
      dedup[dedup.length - 1] = normalized[i];
    } else {
      dedup.push(normalized[i]);
    }
  }

  _dateKeys = new Array(dedup.length);
  _rows = new Array(dedup.length);
  _posByKey.clear();

  for (let i = 0; i < dedup.length; i++) {
    const { _key, ...row } = dedup[i];
    _dateKeys[i] = _key;
    _rows[i] = row;
    _posByKey.set(_key, i);
  }

  _ready = true;
  return getDayIndexInfo();
}

export function clearDayIndex() {
  _ready = false;
  _dateKeys = [];
  _rows = [];
  _posByKey.clear();
}

/* =========================
 * 업서트 (원본 유지)
 * ========================= */
export function upsertDayRows(rows) {
  if (!_ready || rows.length > Math.max(1000, _rows.length * 0.25)) {
    return buildIndex([ ..._rows, ...rows ]);
  }

  let mutated = false;
  const toInsert = [];
  for (const r of rows) {
    const n = normalizeRow(r);
    if (!n.date || !Number.isFinite(n._key)) continue;

    if (_posByKey.has(n._key)) {
      const idx = _posByKey.get(n._key);
      _rows[idx] = { date: n.date, power: n.power, price: n.price };
      mutated = true;
    } else {
      toInsert.push(n);
    }
  }

  if (toInsert.length) {
    return buildIndex([ ..._rows, ...toInsert ]);
  }

  return getDayIndexInfo();
}

/* =========================
 * 이진 탐색/다운샘플 (원본 유지)
 * ========================= */
function lowerBound(arr, target) { let lo = 0, hi = arr.length; while (lo < hi) { const mid = (lo + hi) >> 1; if (arr[mid] < target) lo = mid + 1; else hi = mid; } return lo; }
function upperBound(arr, target) { let lo = 0, hi = arr.length; while (lo < hi) { const mid = (lo + hi) >> 1; if (arr[mid] <= target) lo = mid + 1; else hi = mid; } return lo; }
function downsampleAverage(rows, limit) {
  if (!limit || rows.length <= limit) return rows;
  const buckets = limit;
  const size = Math.ceil(rows.length / buckets);
  const out = [];
  for (let i = 0; i < rows.length; i += size) {
    const chunk = rows.slice(i, i + size);
    if (!chunk.length) continue;
    const powerAvg = chunk.reduce((s, r) => s + r.power, 0) / chunk.length;
    const priceAvg = chunk.reduce((s, r) => s + r.price, 0) / chunk.length;
    out.push({ date: chunk[0].date, power: powerAvg, price: priceAvg });
  }
  return out;
}

/* =========================
 * 조회 API (원본 유지)
 * ========================= */
export function fetchDayRange(startYmd, endYmd, options = {}) {
  if (!_ready) throw new Error("Day index is not initialized. Call preloadDayIndex() first.");
  const { inclusive = true, limit } = options;

  const s = keyFromYmd(toYMD(startYmd));
  const e = keyFromYmd(toYMD(endYmd));
  if (!Number.isFinite(s) || !Number.isFinite(e)) return [];

  const left = lowerBound(_dateKeys, Math.min(s, e));
  const right = inclusive ? upperBound(_dateKeys, Math.max(s, e))
                          : lowerBound(_dateKeys, Math.max(s, e));

  const slice = _rows.slice(left, right);
  return downsampleAverage(slice, limit);
}

export function fetchDayAround(centerYmd, beforeDays = 30, afterDays = 30, options = {}) {
  const c = toYMD(centerYmd);
  if (!c) return [];
  const d = new Date(c);
  const start = new Date(d); start.setDate(d.getDate() - beforeDays);
  const end = new Date(d);   end.setDate(d.getDate() + afterDays);
  const sY = start.getFullYear();
  const sM = String(start.getMonth() + 1).padStart(2, "0");
  const sD = String(start.getDate()).padStart(2, "0");
  const eY = end.getFullYear();
  const eM = String(end.getMonth() + 1).padStart(2, "0");
  const eD = String(end.getDate()).padStart(2, "0");
  return fetchDayRange(`${sY}-${sM}-${sD}`, `${eY}-${eM}-${eD}`, options);
}

export function getDayIndexInfo() {
  const count = _rows.length;
  const minDate = count ? _rows[0].date : null;
  const maxDate = count ? _rows[count - 1].date : null;
  return { ready: _ready, count, minDate, maxDate };
}

/* =========================
 * 프리로드 (백엔드 powercustom.cjs 대응)
 * ========================= */

// (원본)
// export async function preloadDayIndex({ force = false, sampleYears = 3 } = {}) {
//   if (_ready && !force) return getDayIndexInfo();
//   if (isSample()) { const rows = await generateSampleYears(sampleYears); return buildIndex(rows); }
//   let rows = [];
//   try {
//     const { data } = await http.get("/api/power-data/day-all");
//     rows = Array.isArray(data?.rows) ? data.rows
//          : Array.isArray(data?.data) ? data.data
//          : Array.isArray(data) ? data
//          : [];
//   } catch {
//     const from = "2000-01-01";
//    const to = "2099-12-31";
//     const { data } = await http.get(`/api/power-data/day`, { params: { from, to } });
//     rows = Array.isArray(data?.rows) ? data.rows
//          : Array.isArray(data?.data) ? data.data
//          : Array.isArray(data) ? data
//          : [];
//   }
//   return buildIndex(rows);
// }

// 수정됨: 백엔드가 powercustom.cjs를 통해 “선택구간” 전용 엔드포인트를 가질 수 있어 추가 fallback 경로를 더 넣음
export async function preloadDayIndex({ force = false, sampleYears = 3 } = {}) {
  if (_ready && !force) return getDayIndexInfo();

  if (isSample()) {
    const rows = await generateSampleYears(sampleYears);
    return buildIndex(rows);
  }

  let rows = [];
  // 1순위: 전체 덤프
  try {
    const { data } = await http.get("/api/power-data/day-all");
    rows = Array.isArray(data?.rows) ? data.rows
         : Array.isArray(data?.data) ? data.data
         : Array.isArray(data) ? data
         : [];
    if (!rows.length) throw new Error("empty");
  } catch {}

  // 2순위: from~to 범위 조회 (기존 백업)
  if (!rows.length) {
    try {
      const from = "2000-01-01";
      const to = "2099-12-31";
      const { data } = await http.get(`/api/power-data/day`, { params: { from, to } });
      rows = Array.isArray(data?.rows) ? data.rows
           : Array.isArray(data?.data) ? data.data
           : Array.isArray(data) ? data
           : [];
      if (!rows.length) throw new Error("empty");
    } catch {}
  }

  // 3순위: 선택구간 전용(powercustom.cjs) 경로 추정 대응
  //   - /api/power-custom/range?from=YYYY-MM-DD&to=YYYY-MM-DD
  //   - 또는  POST /api/power-custom/range { from, to }
  if (!rows.length) {
    try {
      const from = "2000-01-01";
      const to = "2099-12-31";
      try {
        const { data } = await http.get("/api/power-custom/range", { params: { from, to } });
        rows = Array.isArray(data?.rows) ? data.rows
             : Array.isArray(data?.data) ? data.data
             : Array.isArray(data) ? data
             : [];
      } catch {
        const { data } = await http.post("/api/power-custom/range", { from, to });
        rows = Array.isArray(data?.rows) ? data.rows
             : Array.isArray(data?.data) ? data.data
             : Array.isArray(data) ? data
             : [];
      }
    } catch {}
  }

  return buildIndex(rows);
}

/* =========================
 * 샘플 데이터 생성 (원본 유지)
 * ========================= */
async function generateSampleYears(years = 3) {
  const out = [];
  const today = new Date();
  const end = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const start = new Date(end);
  start.setUTCFullYear(end.getUTCFullYear() - Math.max(1, years));

  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const ymd = `${y}-${m}-${day}`;

    const dayOfYear =
      Math.floor((Date.UTC(y, d.getUTCMonth(), d.getUTCDate()) - Date.UTC(y, 0, 0)) / 86400000);
    const seasonal = 10 + 5 * Math.sin((2 * Math.PI * dayOfYear) / 365.25);
    const weekly = 1.5 * Math.sin((2 * Math.PI * (d.getUTCDay() || 7)) / 7);
    const noise = (Math.random() - 0.5) * 2;
    const power = Math.max(0, seasonal + weekly + noise * 0.8);
    const price = Math.round(power * 200 + (Math.random() - 0.5) * 80);

    out.push({ date: ymd, power: Number(power.toFixed(2)), price });
    if (out.length % 5000 === 0) await Promise.resolve();
  }
  return out;
}
