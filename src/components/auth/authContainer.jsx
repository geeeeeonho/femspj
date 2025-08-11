// 📁 src/components/auth/authContainer.jsx
/*
  설명:
  - 로그인/회원가입 화면을 전환하며 보여주는 컨테이너입니다.
  - 로그인 성공 시 '/'로 이동합니다.
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import LoginInputComponent from "./loginInput";
import SignupInputComponent from "./signupInput";

function AuthContainer() {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // ✅ 로그인 처리
  const handleLogin = async (email, password) => {
    setError("");
    try {
      await login(email, password);
      navigate("/"); // 메인 페이지로 이동
    } catch (err) {
      console.error("로그인 실패:", err);
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  // ✅ 회원가입 처리
  const handleSignup = async (formData) => {
    setError("");
    try {
      await register(formData); // {company, name, phone, email, password}
      alert("회원가입이 완료되었습니다. 로그인 해주세요.");
      setIsSignup(false); // 로그인 폼으로 전환
    } catch (err) {
      console.error("회원가입 실패:", err);
      setError("회원가입에 실패했습니다. 입력한 정보를 다시 확인해주세요.");
    }
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
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
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
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
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
