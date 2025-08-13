// 📁 src/components/auth/authContainer.jsx
/*
  설명:
  - 로그인/회원가입 화면을 전환하며 보여주는 컨테이너입니다.
  - 로그인 성공 시 직전 목적지(state.from) 또는 '/'로 이동합니다.
*/

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import LoginInputComponent from "./loginInput";
import SignupInputComponent from "./signupInput";

function AuthContainer() {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const from = location.state?.from?.pathname || "/";

  // ✅ 로그인 처리 (반환값 success 체크)
  const handleLogin = async (email, password) => {
    setError("");
    setSubmitting(true);
    try {
      const res = await login(email, password); // { success, token?, user?, message? }
      if (!res?.success) {
        setError(res?.message || "이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
      }
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        "로그인에 실패했습니다. 다시 시도해 주세요.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ 회원가입 처리 (반환값 success 체크)
  const handleSignup = async (formData) => {
    setError("");
    setSubmitting(true);
    try {
      const res = await register(formData); // { success, message?, user? } 형태 가정
      if (!res?.success) {
        setError(res?.message || "회원가입에 실패했습니다. 입력 내용을 확인해 주세요.");
        return;
      }
      alert("회원가입이 완료되었습니다. 로그인해 주세요.");
      setIsSignup(false); // 로그인 폼으로 전환
    } catch (err) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      setError(msg);
    } finally {
      setSubmitting(false);
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
          <SignupInputComponent onSignup={handleSignup} disabled={submitting} />
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          <button
            className="mt-4 text-blue-600 underline text-sm disabled:opacity-60"
            onClick={() => setIsSignup(false)}
            disabled={submitting}
          >
            계정이 있으신가요? 로그인하기
          </button>
        </>
      ) : (
        <>
          <LoginInputComponent onLogin={handleLogin} disabled={submitting} />
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          <button
            className="mt-4 text-blue-600 underline text-sm disabled:opacity-60"
            onClick={() => setIsSignup(true)}
            disabled={submitting}
          >
            계정이 없으신가요? 회원가입 하기
          </button>
        </>
      )}
    </div>
  );
}

export default AuthContainer;
