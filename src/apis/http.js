// 📁 src/apis/http.js
import axios from "axios";

/* -------------------------------------------------
 * 1) 샘플 모드 중앙 관리 (http만 책임)
 *    - true  → 모든 API가 샘플 데이터 사용
 *    - false → 실제 서버 호출
 *    - 우선순위: localStorage('sampleMode') → VITE_SAMPLE_MODE → 기본 true(개발 편의)
 * ------------------------------------------------- */
const LS_SAMPLE_KEY = "sampleMode";

let _sampleMode = (() => {
  try {
    const saved = localStorage.getItem(LS_SAMPLE_KEY);
    if (saved != null) return saved === "true";
  } catch (_) {}
  const env = import.meta.env?.VITE_SAMPLE_MODE;
  if (typeof env !== "undefined") return String(env) === "true";
  return true; //<--- 여기에서 true:샘플 | false:서버
})();

export function isSample() {
  return _sampleMode === true;
}

export function setSampleMode(v) {
  _sampleMode = !!v;
  try {
    localStorage.setItem(LS_SAMPLE_KEY, String(_sampleMode)); // 키 유지
  } catch (_) {}
}

/* -------------------------------------------------
 * 2) 베이스 URL
 *    - 개발: "" → Vite proxy('/auth','/api') 사용
 *    - 배포: VITE_API_BASE_URL 또는 기본 호스트
 * ------------------------------------------------- */
const isDev = !!import.meta.env?.DEV;
const BASE_ORIGIN =
  import.meta.env?.VITE_API_BASE_URL ?? (isDev ? "" : "https://api.sensor-tive.com");

/* -------------------------------------------------
 * 3) axios 인스턴스
 * ------------------------------------------------- */
export const http = axios.create({
  baseURL: BASE_ORIGIN, // dev에선 상대경로 → Vite 프록시
  timeout: 15000,
  withCredentials: false,
});

/* -------------------------------------------------
 * 4) 요청 인터셉터: 토큰 부착
 * ------------------------------------------------- */
http.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) {
    cfg.headers = cfg.headers ?? {};
    cfg.headers.Authorization = `Bearer ${t}`;
  }
  return cfg;
});

/* -------------------------------------------------
 * 5) 응답 인터셉터: 401 처리
 *    - 샘플 모드일 때는 세션 정리/리다이렉트 하지 않음
 * ------------------------------------------------- */
http.interceptors.response.use(
  (res) => res,
  (e) => {
    const status = e?.response?.status;
    const here = (typeof window !== "undefined" && window.location?.pathname) || "";

    if (!isSample() && status === 401 && !here.startsWith("/auth")) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (_) {}
      if (typeof window !== "undefined") {
        window.location.assign("/auth");
      }
    }
    return Promise.reject(e);
  }
);
