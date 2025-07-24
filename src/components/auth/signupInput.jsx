// 📁 src/components/auth/signupInput.jsx
// 설명: registerApi를 직접 호출하여 회원가입 요청을 처리하는 버전

import { useState } from "react";
import { registerApi } from "../../apis/authApi";

function SignupInputComponent() {
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authAlarm, setAuthAlarm] = useState(false); // ✅ 알람 수신 여부

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await registerApi({
        company,
        name,
        phone,
        email,
        password,
        authAlarm, // ✅ 전송에 포함
      });
      console.log("✅ 회원가입 성공:", result);
      alert("회원가입 성공!");
    } catch (error) {
      console.error("❌ 회원가입 실패:", error.response?.data || error);
      alert("회원가입 실패: " + (error.response?.data?.message || "서버 오류"));
    }
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

      {/* ✅ 알람 수신 여부 체크박스 */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="authAlarm"
          checked={authAlarm}
          onChange={(e) => setAuthAlarm(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="authAlarm" className="text-sm text-gray-700">
          이메일 및 문자 알림 수신에 동의합니다.
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700"
      >
        회원가입
      </button>
    </form>
  );
}

export default SignupInputComponent;
