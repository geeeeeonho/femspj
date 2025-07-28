// 📁 src/layouts/authLayout.jsx

import { useState } from "react";

function AuthLayout() {
  const [activeTab, setActiveTab] = useState("intro");

  const renderContent = () => {
    switch (activeTab) {
      case "intro":
        return <p className="mt-6">스마트 에너지 관리 시스템 FEMSystem에 오신 걸 환영합니다.</p>;
      case "contact":
        return <p className="mt-6">문의: contact@fems.com<br />전화: 010-1234-5678</p>;
      case "system":
        return <p className="mt-6">전력 모니터링, 분석, 알림 시스템이 통합된 솔루션을 제공합니다.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full bg-white/30 backdrop-blur-md rounded-xl p-10 text-white flex flex-col justify-between shadow-lg">
      {/* 버튼 그룹 */}
      <div className="flex space-x-4">
        {[
          { id: "intro", label: "기본 소개" },
          { id: "contact", label: "문의하기" },
          { id: "system", label: "시스템 소개" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-full border transition font-medium ${
              activeTab === tab.id
                ? "bg-white text-gray-900"
                : "border-white/50 text-white hover:bg-white/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 설명 텍스트 */}
      <div className="text-lg leading-relaxed">{renderContent()}</div>
    </div>
  );
}

export default AuthLayout;
