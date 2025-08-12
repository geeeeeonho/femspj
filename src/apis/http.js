// 📁 src/apis/http.js
import axios from "axios";

/* -------------------------------------------------
 * 1) 샘플 모드 중앙 관리
 *    ✅ 여기에서 true / false 변경해서 전체 API 샘플모드 전환
 *    - true  → 모든 API에서 샘플 데이터 사용
 *    - false → 서버 API 호출
 * ------------------------------------------------- */
let _sampleMode = true;  // ←←← 여기서 true/false로 변경!

export function isSample() {
  return _sampleMode === true;
}
export function setSampleMode(v) {
  _sampleMode = !!v;
  localStorage.setItem("sampleMode", String(_sampleMode));
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
  baseURL: BASE_ORIGIN,
  timeout: 15000,
});

/* -------------------------------------------------
 * 4) 토큰 부착
 * ------------------------------------------------- */
http.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

/* -------------------------------------------------
 * 5) 401 처리
 *    - 샘플 모드일 땐 절대 세션 정리/리다이렉트 금지
 * ------------------------------------------------- */
http.interceptors.response.use(
  (res) => res,
  (e) => {
    const status = e?.response?.status;
    const here = window.location?.pathname || "";
    if (!isSample() && status === 401 && !here.startsWith("/auth")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth";
      return;
    }
    return Promise.reject(e);
  }
);
