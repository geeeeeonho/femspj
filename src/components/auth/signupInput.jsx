// 회원가입 입력 컴포넌트
// 파일: signupInput.jsx
// 위치: src/components/auth/signupInput.jsx

import { useState } from "react";

function SignupInputComponent({ onSignup }) {
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup({ company, name, phone, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-left font-semibold text-gray-700">회사명</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-left font-semibold text-gray-700">이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-left font-semibold text-gray-700">전화번호</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          required
        />
      </div>
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
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">
        회원가입
      </button>
    </form>
  );
}

export default SignupInputComponent;
