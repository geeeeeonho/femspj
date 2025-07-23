import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PowerScrollHelperComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname !== "/power") {
      // 다른 페이지면 → /power로 이동하면서 scrollTo 상태 전달
      navigate("/power", { state: { scrollTo: id } });
    } else {
      // 현재 power 페이지면 → 바로 스크롤
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-2 divide-y divide-gray-600 text-white text-sm">
      <button
        onClick={() => scrollToSection("weekly")}
        className="w-full px-3 py-2 text-left hover:bg-[rgba(255,255,255,0.1)] transition"
      >
        주간
      </button>
      <button
        onClick={() => scrollToSection("monthly")}
        className="w-full px-3 py-2 text-left hover:bg-[rgba(255,255,255,0.1)] transition"
      >
        월간
      </button>
      <button
        onClick={() => scrollToSection("custom")}
        className="w-full px-3 py-2 text-left hover:bg-[rgba(255,255,255,0.1)] transition"
      >
        선택
      </button>
    </div>
  );
}

export default PowerScrollHelperComponent;
