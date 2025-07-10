// React Context 파일: authContext
/*
  설명:
  - 로그인 상태를 전역으로 관리합니다.
  - localStorage를 통해 새로고침 후에도 상태 유지됩니다.
*/

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(saved);
  }, []);

  const login = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


// 만약 api에서 받아올 경우 이거롤 대체

// src/contexts/authContext.js
// import React, { createContext, useState, useContext, useEffect } from "react";
// import {
//   loginApi,
//   registerApi,
//   updateProfileApi,
//   changePasswordApi,
//   logoutApi,
//   fetchMyProfileApi,
// } from "../api/authApi";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   // 1. localStorage에서 토큰 읽어와서 초기 상태 설정
//   const [token, setToken] = useState(() => localStorage.getItem("token"));
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(!!token); // 토큰 있으면 프로필 fetch 필요

//   // 2. 토큰 있으면 자동으로 내 정보 fetch (최초 렌더링, 토큰 변경 시)
//   useEffect(() => {
//     if (token) {
//       setLoading(true);
//       fetchMyProfileApi(token)
//         .then((data) => setUser(data))
//         .catch(() => {
//           // 토큰 만료/오류면 로그아웃
//           setUser(null);
//           setToken(null);
//           localStorage.removeItem("token");
//         })
//         .finally(() => setLoading(false));
//     }
//   }, [token]);

//   // 3. 로그인
//   const login = async (email, password) => {
//     const data = await loginApi(email, password);
//     setToken(data.token);
//     localStorage.setItem("token", data.token);
//     // 로그인 후 내 정보 fetch
//     const me = await fetchMyProfileApi(data.token);
//     setUser(me);
//     return data;
//   };

//   // 4. 로그아웃
//   const logout = async () => {
//     try {
//       await logoutApi(token);
//     } catch (e) {}
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("token");
//   };

//   // 5. 회원가입 등 나머지 함수 동일
//   const register = async (info) => {
//     return await registerApi(info);
//   };
//   const updateProfile = async (profile) => {
//     const data = await updateProfileApi(profile);
//     setUser(data);
//     return data;
//   };
//   const changePassword = async (args) => {
//     return await changePasswordApi(args);
//   };
//   const fetchMyProfile = async () => {
//     if (!token) return null;
//     const me = await fetchMyProfileApi(token);
//     setUser(me);
//     return me;
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading, // 로딩상태(프로필 불러오는 중)
//         login,
//         logout,
//         register,
//         updateProfile,
//         changePassword,
//         fetchMyProfile,
//         setUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
