// // 📁 src/contexts/authContext.jsx
// /*
//   설명:
//   - 로그인/회원가입 상태를 전역에서 관리합니다.
//   - 샘플 또는 실제 API에서 데이터를 받아 사용합니다.
//   - localStorage로 로그인 유지
// */

// import { createContext, useState, useContext, useEffect } from "react";
// import {
//   loginApi,
//   registerApi,
//   fetchMyProfileApi,
//   logoutApi,
//   // updateProfileApi,
//   // changePasswordApi,
// } from "../apis/authApi";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [token, setToken] = useState(() => localStorage.getItem("token"));
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(!!token);

//   const isLoggedIn = !!user && !!token; // ✅ 로그인 상태 여부 계산

//   // 최초 로딩 시 토큰이 있으면 사용자 정보 조회
//   useEffect(() => {
//     if (token) {
//       setLoading(true);
//       fetchMyProfileApi(token)
//         .then((data) => setUser(data))
//         .catch(() => {
//           setToken(null);
//           setUser(null);
//           localStorage.removeItem("token");
//         })
//         .finally(() => setLoading(false));
//     }
//   }, [token]);

//   // 로그인
//   const login = async (email, password) => {
//     const data = await loginApi(email, password);
//     setToken(data.token);
//     setUser(data.user);
//     localStorage.setItem("token", data.token);
//     return data;
//   };

//   // 로그아웃
//   const logout = async () => {
//     try {
//       await logoutApi(token);
//     } catch (_) {}
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem("token");
//   };

//   // 회원가입
//   const register = async ({
//     company,
//     name,
//     phone,
//     email,
//     password,
//     authAlarm = false, // ✅ 기본값: false
//   }) => {
//     const registerInfo = {
//       company,
//       name,
//       phone,
//       email,
//       password,
//       authAlarm, // ✅ 알람 수신 여부 포함
//     };
//     return await registerApi(registerInfo);
//   };

//   // 내 정보 수동 재조회
//   const fetchMyProfile = async () => {
//     if (!token) return null;
//     const me = await fetchMyProfileApi(token);
//     setUser(me);
//     return me;
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         user,
//         loading,
//         isLoggedIn,
//         login,
//         logout,
//         register,
//         fetchMyProfile,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }



// 📁 src/contexts/authContext.jsx
import { createContext, useState, useContext, useEffect, useMemo } from "react";
import { loginApi, registerApi, fetchMyProfileApi, logoutApi } from "../apis/authApi";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // 토큰만으로 즉시 로그인 상태를 확정 (라우팅 끊기지 않게)
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // 버튼/즉시동작만 이걸로

  const isLoggedIn = !!token; // ✅ 중요: user를 기다리지 않음

  // 로그인
  const login = async (email, password) => {
    setLoading(true);
    const res = await loginApi(email, password); // 여기에서 timeout/에러 메시지 처리 권장
    if (res?.token) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user ?? null); // 바로 채워주고,
      setLoading(false);
      return { success: true };
    }
    setLoading(false);
    return { success: false, message: res?.message || "로그인 실패" };
  };

  // 로그아웃
  const logout = async () => {
    try { await logoutApi(token); } catch (_) {}
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  // 회원가입
  const register = async (info) => {
    return await registerApi({
      company: info.company,
      name: info.name,
      phone: info.phone,
      email: info.email,
      password: info.password,
      authAlarm: info.authAlarm ?? false,
    });
  };

  // 비차단 프로필 조회: 토큰 있을 때만, 실패해도 토큰은 유지
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!token) { setUser(null); return; }
      try {
        // fetchMyProfileApi 내부에서 axios timeout(예: 7~8초) 꼭 설정
        const me = await fetchMyProfileApi(token);
        if (!alive) return;
        if (me) setUser(me);
      } catch (_) {
        if (!alive) return;
        // 서버 일시 오류/타임아웃이어도 토큰은 유지 (다음 요청에서 재시도)
        // 필요하면 여기에 재시도 로직(지수 백오프) 추가 가능
      }
    })();
    return () => { alive = false; };
  }, [token]);

  const fetchMyProfile = async () => {
    if (!token) return null;
    const me = await fetchMyProfileApi(token);
    if (me) setUser(me);
    return me;
  };

  const value = useMemo(() => ({
    token,
    user,
    isLoggedIn,   // 토큰만으로 판정
    loading,      // 버튼/즉시동작에서만 true
    login,
    logout,
    register,
    fetchMyProfile,
  }), [token, user, isLoggedIn, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
