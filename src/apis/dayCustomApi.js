// 📁 src/apis/dayCustomApi.js
// 설명: 수년치 일(day) 단위 데이터를 한 번에 적재→인덱싱하고,
//       원하는 기간을 즉시 슬라이스해서 돌려주는 전용 모듈.
// - 파일명: 소문자 시작 카멜(dayCustomApi.js)  ← 리눅스 대소문자 주의
// - export 함수: lowerCamel (init/preload/fetch 등)
// - 컴포넌트가 아니므로 함수명은 대문자 카멜을 쓰지 않음

import { http, isSample } from "./http";

/* =========================
 * 내부 상태 (인메모리 인덱스)
 * ========================= */
let _ready = false;
/** 날짜키(YYYYMMDD 숫자) 오름차순 정렬 배열 */
let _dateKeys = [];     // 예: [20230101, 20230102, ...]
/** 동일한 인덱스의 데이터 행 */
let _rows = [];         // 예: [{ date:"YYYY-MM-DD", power: number, price: number }, ...]
/** 중복 제거/업서트용 맵: dateKey -> index */
let _posByKey = new Map();

/* =========================
 * 유틸: 날짜 정규화/키 변환
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
function keyFromYmd(ymd) {
  // "2025-08-13" -> 20250813
  return parseInt(ymd.replace(/-/g, ""), 10);
}
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
 * 인덱스 빌드/리셋
 * ========================= */
function buildIndex(rawRows) {
  const normalized = rawRows
    .map(normalizeRow)
    .filter((r) => r.date && Number.isFinite(r._key));

  // 날짜키 기준으로 정렬 + 같은 날짜 중복 제거(마지막 값 우선)
  normalized.sort((a, b) => a._key - b._key);
  const dedup = [];
  for (let i = 0; i < normalized.length; i++) {
    if (i > 0 && normalized[i]._key === normalized[i - 1]._key) {
      dedup[dedup.length - 1] = normalized[i]; // 같은 날이면 최신으로 덮어쓰기
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
 * 업서트(증분 반영)
 * - 대량 추가가 들어오면 전체 재빌드가 더 빠름
 * ========================= */
export function upsertDayRows(rows) {
  if (!_ready || rows.length > Math.max(1000, _rows.length * 0.25)) {
    // 준비 전이거나 대량이면 재빌드
    return buildIndex([ ..._rows, ...rows ]);
  }

  // 소량이면 개별 업서트
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
    // 삽입이 섞이면 인덱스 이동 비용이 커지므로 재빌드가 안전/간단
    return buildIndex([ ..._rows, ...toInsert ]);
  }

  return mutated ? getDayIndexInfo() : getDayIndexInfo();
}

/* =========================
 * 바이너리 서치 (하한/상한)
 * ========================= */
function lowerBound(arr, target) {
  let lo = 0, hi = arr.length; // [lo, hi)
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
function upperBound(arr, target) {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/* =========================
 * 다운샘플(버킷 평균)
 * - 차트에 점이 너무 많을 때 limit에 맞춰 축소
 * ========================= */
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
    // 대표 날짜: 버킷 첫 번째 날짜 사용
    out.push({ date: chunk[0].date, power: powerAvg, price: priceAvg });
  }
  return out;
}

/* =========================
 * 조회 API
 * ========================= */
export function fetchDayRange(startYmd, endYmd, options = {}) {
  if (!_ready) throw new Error("Day index is not initialized. Call preloadDayIndex() first.");
  const { inclusive = true, limit } = options;

  const s = keyFromYmd(toYMD(startYmd));
  const e = keyFromYmd(toYMD(endYmd));

  if (!Number.isFinite(s) || !Number.isFinite(e)) return [];

  const left = lowerBound(_dateKeys, Math.min(s, e));
  const right = inclusive ? upperBound(_dateKeys, Math.max(s, e))
                          : lowerBound(_dateKeys, Math.max(s, e)); // 우측 미포함

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
 * 프리로드(한 번에 수년치 적재)
 * - 샘플 모드: 내부 생성기로 수년치 생성
 * - 실서버 모드: /api/power-data/day-all (권장) → 실패 시 백업 경로 시도
 * ========================= */
export async function preloadDayIndex({ force = false, sampleYears = 3 } = {}) {
  if (_ready && !force) return getDayIndexInfo();

  if (isSample()) {
    const rows = await generateSampleYears(sampleYears);
    return buildIndex(rows);
  }

  // 실제 API: 가능한 한 "전체 덤프" 엔드포인트 사용 권장
  // 1) 권장: /api/power-data/day-all
  // 2) 백업: /api/power-data/day?from=YYYY-MM-DD&to=YYYY-MM-DD
  // 엔드포인트 명세는 백엔드에 맞춰 조정해도 됨.
  let rows = [];
  try {
    const { data } = await http.get("/api/power-data/day-all");
    rows = Array.isArray(data?.rows) ? data.rows
         : Array.isArray(data?.data) ? data.data
         : Array.isArray(data) ? data
         : [];
  } catch {
    // 백업 경로: 최대 범위 조회 시도
    const from = "2000-01-01";
    const to = "2099-12-31";
    const { data } = await http.get(`/api/power-data/day`, { params: { from, to } });
    rows = Array.isArray(data?.rows) ? data.rows
         : Array.isArray(data?.data) ? data.data
         : Array.isArray(data) ? data
         : [];
  }

  return buildIndex(rows);
}

/* =========================
 * 샘플 데이터 생성 (수년치)
 * - 계절성 + 주기성 + 노이즈
 * ========================= */
async function generateSampleYears(years = 3) {
  const out = [];
  // 끝 날짜: 오늘 (Asia/Seoul 기준 날짜 문자열만 사용 → 시간대 영향 최소화)
  const today = new Date();
  const end = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const start = new Date(end);
  start.setUTCFullYear(end.getUTCFullYear() - Math.max(1, years));

  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const ymd = `${y}-${m}-${day}`;

    // 간단한 시즌/주기 모델
    const dayOfYear =
      Math.floor((Date.UTC(y, d.getUTCMonth(), d.getUTCDate()) - Date.UTC(y, 0, 0)) / 86400000);
    const seasonal = 10 + 5 * Math.sin((2 * Math.PI * dayOfYear) / 365.25); // 연간 사이클
    const weekly = 1.5 * Math.sin((2 * Math.PI * (d.getUTCDay() || 7)) / 7); // 주간 사이클
    const noise = (Math.random() - 0.5) * 2; // -1 ~ 1
    const power = Math.max(0, seasonal + weekly + noise * 0.8);
    const price = Math.round(power * 200 + (Math.random() - 0.5) * 80); // 대략적 단가

    out.push({ date: ymd, power: Number(power.toFixed(2)), price });
    // 루프가 길 수 있으므로 이벤트 루프 양보
    if (out.length % 5000 === 0) await Promise.resolve();
  }
  return out;
}
