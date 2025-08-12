// 📁 src/apis/authApi.js
import { http, isSample } from "./http";   // ✅ http.js의 스위치를 가져옴

const useSample = isSample();              // ✅ 샘플 모드 중앙 제어(여기선 읽기만)

/* 통일된 에러 메시지 */
const toMsg = (err) => {
  if (err?.code === "ECONNABORTED") return "서버 응답이 지연되었습니다.";
  if (err?.response) return `${err.response.status} ${err.response.statusText}`;
  return "서버에 연결할 수 없습니다.";
};

/* =========================
   샘플 모드 (테스트용)
========================= */
const mockUser = {
  id: "sample-user-001",
  name: "샘플 사용자",
  email: "123@mail.com",
  token: "sample-jwt-token",
};

async function loginMock(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "123@mail.com" && password === "123") {
        resolve({ success: true, token: mockUser.token, user: mockUser });
      } else {
        reject(new Error("❌ 샘플 로그인 실패: 이메일 또는 비밀번호 불일치"));
      }
    }, 300);
  });
}

async function registerMock({ email, password, name }) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 300);
  });
}

async function fetchMyProfileMock() {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve({ id: mockUser.id, name: mockUser.name, email: mockUser.email }),
      300
    );
  });
}

async function logoutMock() {
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 200));
}

/* =========================
   실서버 API (http.js baseURL = /auth 권장)
========================= */
async function loginReal(email, password) {
  try {
    const { data } = await http.post("/login", { email, password });
    const token = data?.token || data?.accessToken;
    const user  = data?.user || null;

    if (!token) return { success: false, message: "토큰이 없습니다." };

    localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));

    return { success: true, token, user };
  } catch (e) {
    return { success: false, message: toMsg(e) };
  }
}

async function registerReal({ company, name, phone, email, password, authAlarm }) {
  try {
    const { data } = await http.post("/register", {
      company, name, phone, email, password, authAlarm,
    });
    return data;
  } catch (e) {
    return { success: false, message: toMsg(e) };
  }
}

async function fetchMyProfileReal() {
  try {
    const { data } = await http.get("/me");
    return data;
  } catch {
    return null;
  }
}

async function logoutReal() {
  try {
    await http.post("/logout");
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

/* =========================
   최종 export (샘플 스위치: http.js의 isSample)
========================= */
export const loginApi          = useSample ? loginMock          : loginReal;
export const registerApi       = useSample ? registerMock       : registerReal;
export const fetchMyProfileApi = useSample ? fetchMyProfileMock : fetchMyProfileReal;
export const logoutApi         = useSample ? logoutMock         : logoutReal;
