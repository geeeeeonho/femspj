// 📁 src/apis/authApi.js

import axios from "axios";

const BASE_URL = 'https://api.sensor-tive.com';

// ✅ 샘플 모드 여부 (true로 설정 시 아래 mock 사용)
const isSampleMode = true;

/* -----------------------------
 * ✅ 샘플 모드용 가짜 데이터
 * ----------------------------- */
const mockUser = {
  id: "sample-user-001",
  name: "샘플 사용자",
  email: "123@mail.com",
  token: "sample-jwt-token",
};

// ✅ 샘플 로그인
async function loginMock(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "123@mail.com" && password === "123") {
        resolve({
          token: mockUser.token,
          user: {
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
          },
        });
      } else {
        reject(new Error("❌ 샘플 로그인 실패: 이메일 또는 비밀번호 불일치"));
      }
    }, 300);
  });
}

// ✅ 샘플 회원가입 (항상 성공으로 처리)
async function registerMock({ email, password, name }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("🧪 샘플 회원가입:", { email, password, name });
      resolve({ success: true });
    }, 300);
  });
}

// ✅ 샘플 프로필 조회
async function fetchMyProfileMock(token) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      });
    }, 300);
  });
}

// ✅ 샘플 로그아웃
async function logoutMock(token) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 200);
  });
}

/* -----------------------------
 * ✅ 실제 API 함수들 (운영용)
 * ----------------------------- */

async function loginReal(email, password) {
  const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
  return res.data;
}

async function registerReal({ company, name, phone, email, password, authAlarm }) {
  const res = await axios.post(`${BASE_URL}/auth/register`, {
    company,
    name,
    phone,
    email,
    password,
    authAlarm,
  });
  return res.data;
}

async function fetchMyProfileReal(token) {
  const res = await axios.get(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

async function logoutReal(token) {
  const res = await axios.post(`${BASE_URL}/auth/logout`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/* -----------------------------
 * ✅ export 분기
 * ----------------------------- */

export const loginApi = isSampleMode ? loginMock : loginReal;
export const registerApi = isSampleMode ? registerMock : registerReal;
export const fetchMyProfileApi = isSampleMode ? fetchMyProfileMock : fetchMyProfileReal;
export const logoutApi = isSampleMode ? logoutMock : logoutReal;
