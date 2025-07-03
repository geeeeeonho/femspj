// 로그인 입력 컴포넌트
// 파일: loginInput.jsx
// 위치: src/components/auth/loginInput.jsx

import { useState } from "react";

function LoginInputComponent({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-left font-semibold text-gray-700">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-left font-semibold text-gray-700">비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          required
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
        로그인
      </button>
    </form>
  );
}

export default LoginInputComponent;
