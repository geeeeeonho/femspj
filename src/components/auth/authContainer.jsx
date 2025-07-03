// React 컨테이너 컴포넌트: 로그인/회원가입 전환 기능 포함
/*
  설명:
  - 기본은 로그인 창을 보여줍니다.
  - "회원가입" 버튼을 누르면 회원가입 폼으로 전환됩니다.
  - 다시 "로그인" 버튼을 누르면 로그인 창으로 돌아옵니다.
  - 로그인 시 / 로 이동
*/

import { useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import LoginInputComponent from "./loginInput";
import SignupInputComponent from "./signupInput";

function AuthContainer() {
  const [isSignup, setIsSignup] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // 로그인 처리 콜백
  const handleLogin = (email, password) => {
    console.log("로그인 요청:", email, password);
    login();        // 로그인 처리
    navigate("/");  // 메인으로 이동
  };

  // 회원가입 처리 콜백
  const handleSignup = (formData) => {
    console.log("회원가입 요청:", formData);
    // 여기에 서버 요청 추가 가능
    alert("회원가입 완료! 로그인 해주세요.");
    setIsSignup(false);  // 다시 로그인 화면으로 전환
  };

  return (
    <div className="w-full max-w-md bg-white bg-opacity-80 p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Easy FEMS</h1>
      <p className="mb-6 text-gray-600">
        {isSignup ? "회원 정보를 입력하세요." : "로그인 정보를 입력하세요."}
      </p>

      {isSignup ? (
        <>
          <SignupInputComponent onSignup={handleSignup} />
          <button
            className="mt-4 text-blue-600 underline text-sm"
            onClick={() => setIsSignup(false)}
          >
            계정이 있으신가요? 로그인하기
          </button>
        </>
      ) : (
        <>
          <LoginInputComponent onLogin={handleLogin} />
          <button
            className="mt-4 text-blue-600 underline text-sm"
            onClick={() => setIsSignup(true)}
          >
            계정이 없으신가요? 회원가입 하기
          </button>
        </>
      )}
    </div>
  );
}

export default AuthContainer;
