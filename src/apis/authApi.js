// 📁 src/apis/authApi.js

import axios from "axios";

// ✅ 환경 변수에서 API 주소 불러오기 (예: .env 또는 .env.production 파일)
const BASE_URL = import.meta.env.VITE_API_BASE;

// ✅ 샘플 모드 여부
const isSampleMode = false;

/* -----------------------------
 * ✅ 실서버 API 함수들 (운영용)
 * ----------------------------- */

// 로그인
async function loginReal(email, password) {
  const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
  return res.data;
}

// 회원가입
async function registerReal({ company, name, phone, email, password }) {
  const res = await axios.post(`${BASE_URL}/auth/register`, {
    company,
    name,
    phone,
    email,
    password,
  });
  return res.data;
}

// 프로필 조회
async function fetchMyProfileReal(token) {
  const res = await axios.get(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// 로그아웃
async function logoutReal(token) {
  const res = await axios.post(`${BASE_URL}/auth/logout`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/* -----------------------------
 * ✅ export 분기
 * ----------------------------- */
export const loginApi = isSampleMode ? null : loginReal;
export const registerApi = isSampleMode ? null : registerReal;
export const fetchMyProfileApi = isSampleMode ? null : fetchMyProfileReal;
export const logoutApi = isSampleMode ? null : logoutReal;
