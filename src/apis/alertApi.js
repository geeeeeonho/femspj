// 📁 src/apis/alertApi.js
import { http, isSample } from "./http";

// 런타임 토글 (샘플/실서버 스위치는 http.js의 isSample()만 사용)
const useSample = isSample();
const isAlertEnabled = true;   // 알림 기능 전체 온/오프

// 샘플 경고 발생 여부
const isSampleAlertProblem = false;

// 추천 기본 개수
const DEFAULT_TOP_N = 3;

/* ---------------------------------
 * 유틸: 숫자 방어 + 범위 보정
 * --------------------------------- */
function toValidTopN(n, fallback = DEFAULT_TOP_N) {
  const x = Number(n);
  if (!Number.isFinite(x)) return fallback;
  return Math.min(Math.max(Math.floor(x), 1), 20); // 1~20 사이로 클램프
}

/* ---------------------------------
 * 유틸: 서버/샘플 추천을 facId 중심으로 정규화
 * --------------------------------- */
function sanitizeRecommendations(recs = []) {
  return (Array.isArray(recs) ? recs : [])
    .map((r, i) => ({
      facId: r?.facId ?? r?.id ?? `unknown-${i}`,
      lineId: r?.lineId ?? r?.line ?? undefined,
      productId: r?.productId ?? r?.product ?? undefined,
    }))
    .filter((r) => !!r.facId);
}

/* ---------------------------------
 * ✅ 샘플 응답 (알람 + 설비만, 시간 ISO)
 * --------------------------------- */
async function fetchPeakAlertSample(topN = DEFAULT_TOP_N) {
  const nowIso = new Date().toISOString();
  const isPeak = isSampleAlertProblem;

  const sampleRecs = isPeak
    ? Array.from({ length: toValidTopN(topN) }).map((_, i) => ({
        facId: `설비${String.fromCharCode(65 + i)}`, // 설비A, 설비B...
        lineId: `line${i + 1}`,
        productId: `제품${i + 1}`,
      }))
    : [];

  return {
    isPeak,
    time: isPeak ? nowIso : null, // ISO로 통일
    recommendations: sanitizeRecommendations(sampleRecs),
    // alertId: undefined,
  };
}

/* ---------------------------------
 * ✅ 실제 API (알람 + 설비만)
 * - 에러시 안전한 기본값 반환
 * - 응답 스키마 방어
 * - (옵션) AbortSignal로 취소 지원
 * --------------------------------- */
async function fetchPeakAlertReal(topN = DEFAULT_TOP_N, { signal } = {}) {
  try {
    const { data } = await http.get("/api/alerts/peak", {
      params: { topN: toValidTopN(topN) },
      signal, // 필요 시 abortController.signal 전달 가능
    });

    return {
      isPeak: !!data?.isPeak,
      time: data?.time ?? null,
      recommendations: sanitizeRecommendations(data?.recommendations),
      alertId: data?.alertId ?? undefined,
    };
  } catch (e) {
    console.error("⚠️ peak API 실패:", e?.message || e);
    return { isPeak: false, time: null, recommendations: [] };
  }
}

/* ---------------------------------
 * ✅ 공개 함수
 * --------------------------------- */
export async function fetchPeakAlert({ topN = DEFAULT_TOP_N, signal } = {}) {
  if (!isAlertEnabled) {
    return { isPeak: false, time: null, recommendations: [] };
  }
  return useSample
    ? fetchPeakAlertSample(topN)
    : fetchPeakAlertReal(topN, { signal });
}
