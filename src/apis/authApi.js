
// 📁 src/apis/authApi.js
// ✅ 로그인/회원가입 관련 API 함수들 (샘플 vs 실제 API 구분)

import axios from "axios";

const BASE_URL = "http://api주소.com"; // 🔁 실제 서버 주소로 변경 필요
const isSampleMode = true; // ✅ true = 샘플 응답 사용, false = 실서버 연결

/* -----------------------------
 * ✅ 샘플 응답 함수들 (개발용)
 * ----------------------------- */
async function loginSample(email, password) {
  if (email === "123@mail.com" && password === "123") {
    return {
      token: "sample-jwt-token",
      user: {
        name: "홍길동",
        email: "123@mail.com",
        company: "테스트 회사",
        phone: "010-1234-5678",
      },
    };
  } else {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }
}

async function registerSample({ company, name, phone, email, password }) {
  console.log("📦 샘플 회원가입 요청:", { company, name, phone, email });
  return { success: true, message: "회원가입 완료" };
}

async function fetchMyProfileSample(token) {
  return {
    name: "홍길동",
    email: "123@mail.com",
    company: "테스트 회사",
    phone: "010-1234-5678",
  };
}

async function logoutSample(token) {
  console.log("📦 샘플 로그아웃 완료");
  return { success: true };
}

/* -----------------------------
 * ✅ 실서버 API 함수들 (운영용)
 * ✅ 아래는 주석처리된 상태로 유지
 * ----------------------------- */

// async function loginReal(email, password) {
//   const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
//   return res.data;
// }

// async function registerReal({ company, name, phone, email, password }) {
//   const res = await axios.post(`${BASE_URL}/auth/register`, {
//     company, name, phone, email, password,
//   });
//   return res.data;
// }

// async function fetchMyProfileReal(token) {
//   const res = await axios.get(`${BASE_URL}/auth/me`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data;
// }

// async function logoutReal(token) {
//   return await axios.post(`${BASE_URL}/auth/logout`, {}, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// }

/* -----------------------------
 * ✅ export 분기 (샘플/실서버)
 * ----------------------------- */
export const loginApi = isSampleMode ? loginSample : null; // loginReal
export const registerApi = isSampleMode ? registerSample : null; // registerReal
export const fetchMyProfileApi = isSampleMode ? fetchMyProfileSample : null; // fetchMyProfileReal
export const logoutApi = isSampleMode ? logoutSample : null; // logoutReal

// 💡 실서버 전환 시 위의 null을 함수로 교체 + isSampleMode를 false로 변경
