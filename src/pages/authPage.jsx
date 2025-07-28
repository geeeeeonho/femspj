// 📁 src/pages/authPage.jsx

import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import AuthLayout from "../layouts/authLayout";
import AuthContainer from "../components/auth/authContainer";

function AuthPage() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("authPage 접근, 로그인 상태:", isLoggedIn, "현재 경로:", location.pathname);
  }, [isLoggedIn, location]);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className="h-screen w-screen flex bg-cover bg-center"
      style={{ backgroundImage: "url('/images/login-bg.png')" }} // ✅ 전체 배경 이미지
    >
      {/* 왼쪽 설명 영역: 내부에서 투명도 설정 */}
      <div className="w-1/2">
        <AuthLayout />
      </div>

      {/* 오른쪽 로그인 영역: 배경 그대로 보여줌 */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md px-8">
          <AuthContainer />
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
