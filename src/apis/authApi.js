// 📁 src/apis/authApi.js
// 로그인/회원가입/프로필/로그아웃 API
// - 샘플 모드일 때는 mock 동작
// - 실서버 모드일 때는 반드시 /auth/* 경로 사용 (백엔드 라우팅과 일치)
// - http.js의 axios 인스턴스와 isSample() 스위치를 사용

import { http, isSample } from "./http";

// 런타임 샘플모드 플래그
const useSample = isSample();

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
  return { success: false, message: "❌ 샘플: 이메일 또는 비밀번호가 올바르지 않습니다." };
}

async function registerMock(info) {
  await delay(300);
  return { success: true, message: "✅ 샘플: 회원가입 성공", user: { ...mockUser, ...info } };
}

async function fetchMyProfileMock() {
  await delay(200);
  return { id: mockUser.id, name: mockUser.name, email: mockUser.email };
}

async function logoutMock() {
  await delay(150);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return { success: true };
}

/* =========================
 * 실서버 모드
 * ========================= */
async function loginReal(email, password) {
  try {
    // ✅ 경로 통일: /auth/login
    const { data } = await http.post("/auth/login", { email, password });

    // 서버 응답 표준화 (token | accessToken, user)
    const token = data?.token || data?.accessToken;
    const user = data?.user ?? null;

    if (!token) {
      return { success: false, message: "로그인 응답에 토큰이 없습니다." };
    }

    localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));

    return { success: true, token, user };
  } catch (e) {
    const status = e?.response?.status;
    const text = e?.response?.statusText;
    const msg = status ? `${status} ${text}` : "서버에 연결할 수 없습니다.";
    return { success: false, message: msg };
  }
}

async function registerReal(info) {
  // ✅ /auth/register
  const { data } = await http.post("/auth/register", info);
  return data;
}

async function fetchMyProfileReal() {
  // ✅ /auth/me
  const { data } = await http.get("/auth/me");
  // 백엔드가 { user: {...} } 또는 바로 유저객체를 줄 수도 있으므로 양쪽 모두 수용
  return data?.user ?? data;
}

async function logoutReal() {
  try {
    // ✅ /auth/logout
    await http.post("/auth/logout");
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  return { success: true };
}

/* =========================
 * Export (샘플/리얼 자동 분기)
 * ========================= */
export const loginApi = useSample ? loginMock : loginReal;
export const registerApi = useSample ? registerMock : registerReal;
export const fetchMyProfileApi = useSample ? fetchMyProfileMock : fetchMyProfileReal;
export const logoutApi = useSample ? logoutMock : logoutReal;
