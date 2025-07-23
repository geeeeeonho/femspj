import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SolutionScrollHelperComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname !== "/solution") {
      // 페이지 이동 + state로 scrollTo 전달
      navigate("/solution", { state: { scrollTo: id } });
    } else {
      // 현재 페이지일 경우 바로 이동
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-2 divide-y divide-gray-600 text-white text-sm">
      <button
        onClick={() => scrollToSection("summary")}
        className="w-full px-3 py-2 text-left hover:bg-[rgba(255,255,255,0.1)] transition"
      >
        분석 요약
      </button>
      <button
        onClick={() => scrollToSection("line-order")}
        className="w-full px-3 py-2 text-left hover:bg-[rgba(255,255,255,0.1)] transition"
      >
        설비 순서
      </button>
      <button
        onClick={() => scrollToSection("simulator")}
        className="w-full px-3 py-2 text-left hover:bg-[rgba(255,255,255,0.1)] transition"
      >
        작업 시뮬
      </button>
    </div>
  );
}

export default SolutionScrollHelperComponent;
