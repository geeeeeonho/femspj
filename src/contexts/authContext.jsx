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
  // ✅ 초기 토큰 정규화 ("undefined" 문자열 방지)
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" ? t : null;
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  // ✅ 토큰만 있으면 로그인으로 간주 (프로필 로딩 여부는 별도)
  const isLoggedIn = !!token;
  const hasProfile = !!user;

  // 공용 정리 함수
  const clearSession = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (_) {}
  };

  // 최초 로딩: 토큰 있으면 프로필 조회
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    if (token === "undefined") {
      clearSession();
      setLoading(false);
      return;
    }

    setLoading(true);
    // fetchMyProfileApi는 http 인터셉터로 토큰을 자동 부착하므로 인자 불필요
    fetchMyProfileApi()
      .then((data) => setUser(data))
      .catch(() => {
        // 토큰이 유효하지 않으면 세션 정리
        clearSession();
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // 로그인
  const login = async (email, password) => {
    const res = await loginApi(email, password);
    if (res?.success) {
      const t = res.token;
      const u = res.user ?? null;
      setToken(t);
      setUser(u);
      try {
        localStorage.setItem("token", t);
        if (u) localStorage.setItem("user", JSON.stringify(u));
      } catch (_) {}
      return { success: true, token: t, user: u };
    } else {
      // 실패 시 세션 보존하지 않음
      clearSession();
      return { success: false, message: res?.message || "로그인에 실패했습니다." };
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await logoutApi(); // 인자 불필요
    } catch (_) {}
    clearSession();
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
    try {
      const me = await fetchMyProfileApi();
      setUser(me);
      return me;
    } catch (_) {
      clearSession();
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isLoggedIn,
        hasProfile, // (선택) 필요 시 사용
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
