// 📁 src/apis/alertApi.js
import { http, isSample } from "./http";

/* -------------------------------------------------
 * 샘플 모드일 때 경고 발생 여부 on/off
 * ------------------------------------------------- */
let _samplePeakAlert = (() => {
  const ls = localStorage.getItem("samplePeakOn");
  if (ls != null) return ls === "true";
  return false; // 기본값: 꺼짐
})();
export function isSamplePeakAlertOn() {
  return _samplePeakAlert === true;
}
export function setSamplePeakAlert(v) {
  _samplePeakAlert = !!v;
  localStorage.setItem("samplePeakOn", String(_samplePeakAlert));
}

/* -----------------------------
 * 샘플 응답
 * ----------------------------- */
async function fetchPeakAlertSample() {
  const now = new Date();
  return {
    isPeak: _samplePeakAlert,
    time: _samplePeakAlert ? now.toLocaleTimeString("ko-KR") : null,
  };
}

/* -----------------------------
 * 실제 API 호출
 * ----------------------------- */
async function fetchPeakAlertReal() {
  const res = await http.get("/api/alerts/peak");
  return res?.data ?? { isPeak: false, time: null };
}

/* -----------------------------
 * 최종 export
 * ----------------------------- */
export async function fetchPeakAlert() {
  return isSample() ? fetchPeakAlertSample() : fetchPeakAlertReal();
}
