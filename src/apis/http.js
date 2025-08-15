// 📁 src/apis/http.js
// Axios 인스턴스 + 공통 인터셉터
// - 상대경로("api/...","auth/...")가 들어와도 자동으로 절대경로("/api/...","/auth/...")로 보정
// - 토큰 자동 첨부 / 401 처리 (auth 라우트는 예외)
// - 샘플 모드 플래그(isSample) 제공

import axios from "axios";

/* =========================================================
 * 샘플 모드
 *  (원본) 대개 VITE_SAMPLE 또는 로컬스토리지로 제어
 *  (수정됨) 둘 다 지원 + 캐시
 * 
 *  * 🔧 샘플모드 토글 안내
 * [A] 빌드/배포(.env)로 제어:
 *     - .env(.local 등)에 VITE_SAMPLE="true" | "false"
 *       예) VITE_SAMPLE=true  → 샘플모드 ON
 *           VITE_SAMPLE=false → 샘플모드 OFF
 *
 * [B] 런타임(브라우저)로 제어:
 *     - 켜기:  localStorage.setItem("SAMPLE_MODE","true");  location.reload();
 *     - 끄기:  localStorage.removeItem("SAMPLE_MODE");      location.reload();
 *       (또는 localStorage.setItem("SAMPLE_MODE","false"); location.reload();)
 *
 * ⚠️ 주의: isSample()은 최초 계산값을 _cachedSample 에 캐시합니다.
 *          위 설정을 바꾼 뒤에는 페이지 새로고침이 필요합니다.
 * ======================================================= */
// (원본) export const isSample = () => import.meta.env.VITE_SAMPLE === "true";
let _cachedSample = null;
// 수정됨
export const isSample = () => {
  if (_cachedSample !== null) return _cachedSample;

    // [A] .env의 VITE_SAMPLE 로 샘플모드 제어 (빌드/배포 시점)
  const envFlag =
    (typeof import.meta !== "undefined" &&
      import.meta?.env?.VITE_SAMPLE === "true") || true; // ← 샘플모드 ON 조건!!!

  // [B] 브라우저 localStorage 로 샘플모드 제어 (런타임 토글)
  //    - "true" 면 샘플모드 ON
  //    - 항목 삭제 또는 "false" 면 OFF
  const lsFlag =
    typeof localStorage !== "undefined" &&
    localStorage.getItem("SAMPLE_MODE") === "true"; // ← 샘플모드 ON 조건?

  _cachedSample = Boolean(envFlag || lsFlag);
  return _cachedSample;
};

/* =========================================================
 * 기본 인스턴스
 *  (원본) 개발: baseURL="" (Vite 프록시), 운영: 절대 URL
 *  (수정됨) 기본은 "", 운영에서도 빈 값 사용해도 문제 없도록 URL 보정기로 처리
 * ======================================================= */
// (원본) const http = axios.create({ baseURL: "", withCredentials: true });
export const http = axios.create({
  baseURL: "",
  withCredentials: true,
  timeout: 30_000,
});

/* =========================================================
 * 경로 보정 유틸
 *  - "api/..."  → "/api/..."
 *  - "auth/..." → "/auth/..."
 *  - 이미 "http"로 시작하면 그대로 둠
 * ======================================================= */
// (원본) 없음
// 수정됨
function fixPath(url) {
  if (!url || typeof url !== "string") return url;
  const u = url.trim();

  // 절대 URL 또는 이미 루트 절대경로인 경우
  if (/^https?:\/\//i.test(u) || u.startsWith("/")) return u;

  // 상대경로 보정
  if (u.startsWith("api/")) return `/${u}`;
  if (u.startsWith("auth/")) return `/${u}`;
  if (u.startsWith("grafana/")) return `/${u}`; // 필요 시 추가
  if (u.startsWith("prometheus/")) return `/${u}`; // 필요 시 추가

  // 그 외 상대경로는 그대로 두되, 필요 시 루트로 강제
  // return `/${u}`;  // <- 모든 상대경로를 강제로 루트 기준으로 바꾸고 싶다면 주석 해제
  return u;
}

/* =========================================================
 * 요청 인터셉터
 *  - URL 절대경로화
 *  - Authorization 자동 첨부
 *  - 기본 헤더
 * ======================================================= */
// (원본)
// http.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

http.interceptors.request.use(
  (config) => {
    // 수정됨: 경로 보정
    if (config.url) {
      config.url = fixPath(config.url);
    }

    // 수정됨: 기본 헤더
    config.headers = config.headers || {};
    if (!config.headers.Accept) {
      config.headers.Accept = "application/json, text/plain, */*";
    }
    // JSON 전송 기본값
    const method = (config.method || "get").toLowerCase();
    if ((method === "post" || method === "put" || method === "patch") && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    // 수정됨: 토큰 자동 첨부
    try {
      const token = localStorage.getItem("token");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {}

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================================================
 * 응답 인터셉터
 *  - 401 처리(로그인/회원가입/로그아웃 등 auth 경로는 예외)
 *  - HTML(=SPA) 응답이 API 경로(/api,/auth)로 들어왔을 때 디버그 로그
 * ======================================================= */
// (원본)
// http.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err?.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       if (!location.pathname.startsWith("/auth")) location.href = "/auth";
//     }
//     return Promise.reject(err);
//   }
// );

http.interceptors.response.use(
  (res) => {
    // 수정됨: API 경로인데 HTML이 오면 경고 로그 (디버깅용)
    try {
      const reqUrl = res?.config?.url || "";
      const ct = res?.headers?.["content-type"] || "";
      const isApi = typeof reqUrl === "string" && (reqUrl.startsWith("/api/") || reqUrl.startsWith("/auth/"));
      const looksHtml = ct.includes("text/html") || (typeof res?.data === "string" && /^\s*<!doctype html/i.test(res.data));
      if (isApi && looksHtml) {
        // eslint-disable-next-line no-console
        console.warn("⚠️ API 경로에 HTML 응답 감지:", { url: reqUrl, contentType: ct, snippet: String(res.data).slice(0, 120) });
      }
    } catch {}
    return res;
  },
  (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url || "";

    // auth 관련 경로는 401이어도 리다이렉트하지 않음
    const isAuthRoute =
      typeof url === "string" &&
      (url.startsWith("/auth/") || url.includes("/auth/login") || url.includes("/auth/register"));

    if (status === 401 && !isAuthRoute) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch {}
      if (typeof window !== "undefined") {
        // 로그인 화면으로 이동
        if (!window.location.pathname.startsWith("/auth")) {
          window.location.replace("/auth");
        }
      }
    }

    return Promise.reject(err);
  }
);

export default http;
