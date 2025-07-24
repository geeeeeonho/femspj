// 📁 src/contexts/authContext.jsx
/*
  설명:
  - 로그인/회원가입 상태를 전역에서 관리합니다.
  - 샘플 또는 실제 API에서 데이터를 받아 사용합니다.
  - localStorage로 로그인 유지
*/

import { createContext, useState, useContext, useEffect } from "react";
import {
  loginApi,
  registerApi,
  fetchMyProfileApi,
  logoutApi,
  // updateProfileApi,
  // changePasswordApi,
} from "../apis/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  const isLoggedIn = !!user && !!token; // ✅ 로그인 상태 여부 계산

  // 최초 로딩 시 토큰이 있으면 사용자 정보 조회
  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchMyProfileApi(token)
        .then((data) => setUser(data))
        .catch(() => {
          setToken(null);
          setUser(null);
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  // 로그인
  const login = async (email, password) => {
    const data = await loginApi(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    return data;
  };

  // 로그아웃
  const logout = async () => {
    try {
      await logoutApi(token);
    } catch (_) {}
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  // 회원가입
  const register = async ({
    company,
    name,
    phone,
    email,
    password,
    authAlarm = false, // ✅ 기본값: false
  }) => {
    const registerInfo = {
      company,
      name,
      phone,
      email,
      password,
      authAlarm, // ✅ 알람 수신 여부 포함
    };
    return await registerApi(registerInfo);
  };

  // 내 정보 수동 재조회
  const fetchMyProfile = async () => {
    if (!token) return null;
    const me = await fetchMyProfileApi(token);
    setUser(me);
    return me;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isLoggedIn,
        login,
        logout,
        register,
        fetchMyProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
