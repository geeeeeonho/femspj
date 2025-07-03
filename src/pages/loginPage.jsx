// React 페이지 컴포넌트: 로그인 페이지
/*
  설명:
  - 로그인 버튼 클릭 시 로그인 상태가 true가 되고 메인(/)으로 이동합니다.
  - 이미 로그인 되어 있으면 /로 자동 리디렉션됩니다.
*/

import BasicLayout from "../layouts/basicLayout";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function LoginPage() {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");  // 로그인 상태일 경우 메인으로 이동
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = () => {
    login();          // 로그인 상태 true로 설정
    navigate("/");    // 메인으로 리디렉션
  };

  return (
    <BasicLayout>
      <div className="p-4 max-w-md mx-auto mt-24">
        <h1 className="text-xl font-bold mb-4">로그인</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          로그인하기
        </button>
      </div>
    </BasicLayout>
  );
}

export default LoginPage;
