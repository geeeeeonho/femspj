import axios from "axios";

// ✅ 환경 변수에서 API 주소 불러오기
const BASE_URL = 'https://api.sensor-tive.com';

// 샘플 모드 여부
const isSampleMode = true;

// 알림 기능 자체를 켜거나 끌 수 있는 플래그
const isAlertEnabled = true;

// ✅ 샘플 경고 발생 여부 설정
const isSampleAlertProblem = false;

/* -----------------------------
 * ✅ 샘플 응답
 * ----------------------------- */
async function fetchPeakAlertSample() {
  const now = new Date();
  return {
    isPeak: isSampleAlertProblem,
    time: isSampleAlertProblem ? now.toLocaleTimeString("ko-KR") : null,
  };
}

/* -----------------------------
 * ✅ 실제 API
 * ----------------------------- */
async function fetchPeakAlertReal() {
  const res = await axios.get(`${BASE_URL}/api/alerts/peak`);
  return res.data;
}

/* -----------------------------
 * ✅ 최종 export
 * ----------------------------- */
export const fetchPeakAlert = async () => {
  if (!isAlertEnabled) {
    return { isPeak: false, time: null };
  }
  if (isSampleMode) {
    return await fetchPeakAlertSample();
  } else {
    return await fetchPeakAlertReal();
  }
};
