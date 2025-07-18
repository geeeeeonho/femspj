// 📁 src/pages/authPage.jsx
/*
  설명:
  - 로그인 상태이면 "/"로 강제 리다이렉트
  - 로그인되지 않은 경우에만 로그인/회원가입 화면 표시
*/

import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import AuthLayout from "../layouts/authLayout";
import AuthContainer from "../components/auth/authContainer";

function AuthPage() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  // ✅ 디버깅용 로그 (필요 시 삭제 가능)
  useEffect(() => {
    console.log("authPage 접근, 로그인 상태:", isLoggedIn, "현재 경로:", location.pathname);
  }, [isLoggedIn, location]);

  // ✅ 로그인된 경우 홈으로 이동
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout>
      <AuthContainer />
    </AuthLayout>
  );
}

export default AuthPage;
