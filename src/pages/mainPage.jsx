// React 페이지 컴포넌트: 메인 페이지
/*
  설명:
  - 로그인하지 않은 상태면 /auth로 이동합니다.
  - 로그인 상태면 메인 페이지를 보여줍니다.
  - 로그아웃 시 상태 초기화 및 /auth로 전환됩니다.
*/

import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function MainPage() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth"); // 로그인 안된 경우 로그인 페이지로 이동
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="p-4 max-w-2xl mx-auto mt-24">
      <h1 className="text-2xl font-bold">🎉 메인 페이지 (로그인됨)</h1>
      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        로그아웃
      </button>
    </div>
  );
}

export default MainPage;
