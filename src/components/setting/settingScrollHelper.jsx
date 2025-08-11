// 📁 src/components/setting/settingScrollHelperComponent.jsx

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SettingScrollHelperComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname !== "/setting") {
      navigate("/setting", { state: { scrollTo: id } });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col items-center divide-y divide-gray-600 text-white text-sm">
      <button
        onClick={() => scrollToSection("power-type")}
        className="w-full px-2 py-2 text-center hover:bg-[rgba(255,255,255,0.1)] transition"
      >
        전력 유형 설정
      </button>
      <button
        onClick={() => scrollToSection("summary")}
        className="w-full px-2 py-2 text-center hover:bg-[rgba(255,255,255,0.1)] transition"
      >
        설비 순서 조정
      </button>
    </div>
  );
}

export default SettingScrollHelperComponent;
