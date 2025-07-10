import axios from "axios";

// [기본 설정] API baseURL
const BASE_URL = "http://api주소.com"; // 실제 서버 주소로 바꿔줘!

// ✔️ 로그인
export async function loginApi(email, password) {
  const response = await axios.post(`${BASE_URL}/auth/login`, {
    email,
    password,
  });
  return response.data; // { token: "...", ... }
}

// ✔️ 회원가입
export async function registerApi({ company, name, phone, email, password }) {
  const response = await axios.post(`${BASE_URL}/auth/register`, {
    company,
    name,
    phone,
    email,
    password,
  });
  return response.data;
}

// ✔️ 회원정보(프로필) 변경
export async function updateProfileApi({ company, name, phone, email }) {
  const response = await axios.put(`${BASE_URL}/auth/update-profile`, {
    company,
    name,
    phone,
    email,
  });
  return response.data;
}

// ✔️ 비밀번호 변경
export async function changePasswordApi({ email, oldPassword, newPassword }) {
  const response = await axios.put(`${BASE_URL}/auth/change-password`, {
    email,
    oldPassword,
    newPassword,
  });
  return response.data;
}

// ✔️ 로그아웃 (JWT 방식은 주로 프론트만, 세션/블랙리스트라면 API 필요)
export async function logoutApi(token) {
  // 토큰 필요시 헤더에 포함
  return await axios.post(`${BASE_URL}/auth/logout`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}

// (선택) 내 정보 조회 등 필요에 따라 추가 가능
export async function fetchMyProfileApi(token) {
  const response = await axios.get(`${BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
}
