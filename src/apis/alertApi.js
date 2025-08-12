// 📁 src/apis/alertApi.js
import { http, isSample } from "./http";

/* =========================================================
 * ★ 수정 포인트 (위에서 바로 변경)
 * ---------------------------------------------------------
 * 1) FORCE_PEAK
 *    - null  : 서버/샘플 응답 그대로 사용
 *    - true  : 무조건 피크로 간주
 *    - false : 무조건 정상으로 간주(추천설비/시간 초기화)
 * 2) EMAIL_ENABLED
 *    - true  : 메일 전송 기능 활성
 *    - false : 메일 전송 기능 비활성(전송 스킵)
 * 3) DEFAULT_SAMPLE_PEAK
 *    - 샘플 모드에서 로컬스토리지에 값이 없을 때의 기본 피크값
 * ======================================================= */
const FORCE_PEAK = null;         // ←★ 필요 시 true/false 로 강제
const EMAIL_ENABLED = false;      // ←★ 메일 전송 on/off
const DEFAULT_SAMPLE_PEAK = false; // ←★ 샘플 기본 피크값

/**
 * 표준 응답 스키마
 * {
 *   isPeak: boolean,
 *   time: string | null,
 *   recommendations: Array<{ facId: string, name?: string }>
 * }
 */

const SAMPLE_EMAIL = "123@mail.com";

/* -------------------------------------------------
 * 샘플 모드: 피크 on/off 스위치 (로컬스토리지 존중)
 * ------------------------------------------------- */
let _samplePeakAlert = (() => {
  const ls = localStorage.getItem("samplePeakOn");
  if (ls != null) return ls === "true";
  return DEFAULT_SAMPLE_PEAK; // ★ 위의 기본값 사용
})();
export function isSamplePeakAlertOn() {
  return _samplePeakAlert === true;
}
export function setSamplePeakAlert(v) {
  _samplePeakAlert = !!v;
  localStorage.setItem("samplePeakOn", String(_samplePeakAlert));
}

/* -------------------------------------------------
 * 현재 로그인 사용자 이메일 자동 획득
 * 순서: 샘플 → /auth/me → JWT(localStorage)
 * ------------------------------------------------- */
async function getMyEmail() {
  if (isSample()) return SAMPLE_EMAIL;

  try {
    const res = await http.get("/auth/me");
    const email = res?.data?.user?.email ?? res?.data?.email ?? null;
    if (email) return email;
  } catch (e) {
    console.warn("[alertApi] /auth/me failed:", e);
  }

  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken");
    if (token && token.split(".").length === 3) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const email =
        payload?.email ?? payload?.user?.email ?? payload?.claims?.email ?? null;
      if (email) return email;
    }
  } catch {
    /* ignore */
  }

  return null; // 서버가 JWT로 식별
}

/* -------------------------------------------------
 * 서버/샘플 응답 → FE 표준 스키마 정규화 (전기표시/사유 제거)
 * ------------------------------------------------- */
function normalizeAlertPayload(raw) {
  const recs = Array.isArray(raw?.recommendations) ? raw.recommendations : [];
  const normalizedRecs = recs
    .map((r) => ({
      facId: r.facId ?? r.id ?? r.deviceId ?? "",
      name: r.name ?? r.label ?? r.title ?? undefined,
    }))
    .filter((r) => r.facId);

  return {
    isPeak: !!raw?.isPeak,
    time: raw?.time ?? null,
    recommendations: normalizedRecs,
  };
}

/* -------------------------------------------------
 * 피크 강제 오버라이드 적용 (FORCE_PEAK)
 * ------------------------------------------------- */
function applyPeakOverride(data) {
  if (FORCE_PEAK === null) return data;           // 응답 그대로
  if (FORCE_PEAK === true) return { ...data, isPeak: true };
  // FORCE_PEAK === false → 정상으로 덮어쓰기
  return { ...data, isPeak: false, time: null, recommendations: [] };
}

/* -------------------------------------------------
 * 샘플 데이터 (설비만)
 * ------------------------------------------------- */
async function fetchPeakAlertSample() {
  const now = new Date();
  const base = {
    isPeak: _samplePeakAlert,
    time: _samplePeakAlert ? now.toLocaleTimeString("ko-KR") : null,
  };
  const sampleRecs = !_samplePeakAlert
    ? []
    : [
        { facId: "FAC-101", name: "프레스 1호기" },
        { facId: "FAC-207", name: "건조기 라인B" },
      ];

  return applyPeakOverride(normalizeAlertPayload({ ...base, recommendations: sampleRecs }));
}

/* -------------------------------------------------
 * 실제 API
 * ------------------------------------------------- */
async function fetchPeakAlertReal() {
  const res = await http.get("/api/alerts/peak");
  return applyPeakOverride(
    normalizeAlertPayload(res?.data ?? { isPeak: false, time: null, recommendations: [] })
  );
}

/* -------------------------------------------------
 * 🔔 피크 알림 이메일 전송
 * - 전기표시/사유 없이 설비 목록만 전송
 * - EMAIL_ENABLED=false 이면 스킵
 * ------------------------------------------------- */
export async function sendPeakAlertEmail(payload) {
  if (!EMAIL_ENABLED) {
    console.info("[alertApi] email disabled by top-level switch");
    return { ok: true, skipped: true, reason: "email_disabled" };
  }

  const to = await getMyEmail();

  // 안전한 전송용 리스트 (facId, name만)
  const safeRecs = Array.isArray(payload?.recommendations)
    ? payload.recommendations
        .map((r) => ({
          facId: r?.facId ?? "",
          name: r?.name ?? undefined,
        }))
        .filter((r) => r.facId)
    : [];

  const body = {
    time: payload?.time ?? null,
    recommendations: safeRecs,
    ...(to ? { to } : {}),
  };

  if (isSample()) {
    console.info("[sample] sendPeakAlertEmail", body);
    return { ok: true, sample: true };
  }

  const res = await http.post("/api/alerts/peak/email", body);
  return res?.data ?? { ok: true };
}

/* -------------------------------------------------
 * 최종 export
 * ------------------------------------------------- */
export async function fetchPeakAlert() {
  return isSample() ? fetchPeakAlertSample() : fetchPeakAlertReal();
}
