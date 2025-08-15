// 📁 src/apis/authApi.js
// 로그인/회원가입/프로필/로그아웃 API
// - 샘플 모드일 때는 mock 동작
// - 실서버 모드일 때는 반드시 /auth/* 경로 사용 (백엔드 라우팅과 일치)
// - http.js의 axios 인스턴스와 isSample() 스위치를 사용

import { http, isSample } from "./http";

/* =========================
 * 샘플 모드 (테스트용)
 * ========================= */
const mockUser = {
  id: "sample-user-001",
  name: "샘플 사용자",
  email: "123@mail.com",
  token: "sample-jwt-token",
};

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function loginMock(email, password) {
  await delay(300);
  if (email === "123@mail.com" && password === "123") {
    const token = mockUser.token;
    const user = { id: mockUser.id, name: mockUser.name, email: mockUser.email };
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return { success: true, token, user };
  }
  // (원본) return { success: false, message: "❌ 이메일 또는 비밀번호가 올바르지 않습니다." };
  return { success: false, message: "❌ 이메일 또는 비밀번호가 올바르지 않습니다." };
}

async function registerMock(info) {
  await delay(300);
  // (원본) return { success: true, message: "✅ 회원가입 성공", user: { ...mockUser, ...info } };
  return { success: true, message: "✅ 회원가입 성공", user: { ...mockUser, ...info } };
}

async function fetchMyProfileMock() {
  await delay(200);
  // (원본) return { id: mockUser.id, name: mockUser.name, email: mockUser.email };
  return { id: mockUser.id, name: mockUser.name, email: mockUser.email };
}

async function logoutMock() {
  await delay(150);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // (원본) return { success: true };
  return { success: true };
}

/* =========================
 * 실서버 모드
 * ========================= */

/* ▼▼▼ MOD #1: 로그인 응답 정규화 & 에러 반환 일관화 (원본은 아래 주석 참고) ▼▼▼ */
// (원본)
// async function loginReal(email, password) {
//   try {
//     // ✅ 경로 통일: /auth/login
//     const { data } = await http.post("/auth/login", { email, password });
//
//     // 서버 응답 표준화 (token | accessToken, user)
//     const token = data?.token || data?.accessToken;
//     const user = data?.user ?? null;
//
//     if (!token) {
//       return { success: false, message: "로그인 응답에 토큰이 없습니다." };
//     }
//
//     localStorage.setItem("token", token);
//     if (user) localStorage.setItem("user", JSON.stringify(user));
//
//     return { success: true, token, user };
//   } catch (e) {
//     // ✅ 서버 메시지 우선, 없으면 상태별 기본 문구
//     const serverMsg = e?.response?.data?.message;
//     const status = e?.response?.status;
//     const fallback =
//       status === 401
//         ? "이메일 또는 비밀번호가 올바르지 않습니다."
//         : "서버에 연결할 수 없습니다.";
//     return { success: false, message: serverMsg || fallback };
//   }
// }
async function loginReal(email, password) {
  try {
    const { data } = await http.post("/auth/login", { email, password });

    // 다양한 키 수용 + "Bearer " 접두사 제거
    let token =
      data?.token ??
      data?.accessToken ??
      data?.jwt ??
      data?.data?.token ??
      data?.data?.accessToken ??
      data?.data?.jwt ??
      null;

    if (typeof token === "string" && token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    const user =
      data?.user ??
      data?.data?.user ??
      data?.profile ??
      null;

    if (!token) {
      return { success: false, message: "로그인 응답에 토큰이 없습니다." };
    }

    localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));

    // 항상 동일한 구조로 반환
    return { success: true, token, user, raw: data };
  } catch (e) {
    const status = e?.response?.status;
    const serverMsg = e?.response?.data?.message;
    const fallback =
      status === 401
        ? "이메일 또는 비밀번호가 올바르지 않습니다."
        : "서버에 연결할 수 없습니다.";
    return { success: false, message: serverMsg || fallback };
  }
}
/* ▲▲▲ MOD #1 끝 ▲▲▲ */

async function registerReal(info) {
  try {
    // (원본) const { data } = await http.post("/auth/register", info);
    const { data } = await http.post("/auth/register", info);
    // (원본) return { success: true, ...data };
    return { success: true, ...data };
  } catch (e) {
    // (원본) const msg = e?.response?.data?.message || "회원가입에 실패했습니다.";
    const msg = e?.response?.data?.message || "회원가입에 실패했습니다.";
    // (원본) return { success: false, message: msg };
    return { success: false, message: msg };
  }
}

/* ▼▼▼ MOD #2: /auth/me 응답을 항상 '유저 객체'로 정규화하고 로컬 저장 동기화 ▼▼▼ */
// (원본)
// async function fetchMyProfileReal() {
//   try {
//     // ✅ /auth/me
//     const { data } = await http.get("/auth/me");
//     // 백엔드가 { user: {...} } 또는 바로 유저객체를 줄 수도 있으므로 양쪽 모두 수용
//     return data?.user ?? data;
//   } catch (e) {
//     const msg = e?.response?.data?.message || "프로필을 불러오지 못했습니다.";
//     throw new Error(msg);
//   }
// }
async function fetchMyProfileReal() {
  try {
    const { data } = await http.get("/auth/me");
    const user = data?.user ?? data ?? null;
    if (!user) throw new Error("프로필 응답이 비어 있습니다.");

    // 최신 유저 정보를 로컬에 동기화(선택)
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch {}
    return user;
  } catch (e) {
    const msg = e?.response?.data?.message || "프로필을 불러오지 못했습니다.";
    throw new Error(msg);
  }
}
/* ▲▲▲ MOD #2 끝 ▲▲▲ */

async function logoutReal() {
  try {
    // (원본) await http.post("/auth/logout");
    await http.post("/auth/logout");
  } finally {
    // (원본) localStorage.removeItem("token"); localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  // (원본) return { success: true };
  return { success: true };
}

/* =========================
 * Export (샘플/리얼 자동 분기: 매 호출마다 isSample() 평가)
 * ========================= */
export const loginApi = (email, password) =>
  isSample() ? loginMock(email, password) : loginReal(email, password);

export const registerApi = (info) =>
  isSample() ? registerMock(info) : registerReal(info);

export const fetchMyProfileApi = () =>
  isSample() ? fetchMyProfileMock() : fetchMyProfileReal();

export const logoutApi = () =>
  isSample() ? logoutMock() : logoutReal();
