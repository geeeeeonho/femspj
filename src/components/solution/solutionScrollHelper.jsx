import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SolutionScrollHelperComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname !== "/solution") {
      navigate("/solution", { state: { scrollTo: id } });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col items-center divide-y divide-gray-600 text-white text-sm">
      <button
        onClick={() => scrollToSection("summary")}
        className="w-full py-2 text-center hover:bg-[rgba(255,255,255,0.1)] transition"
      >
        분석 요약
      </button>

      <button
        onClick={() => scrollToSection("simulator")}
        className="w-full py-2 text-center hover:bg-[rgba(255,255,255,0.1)] transition"
      >
        작업 시뮬
      </button>
    </div>
  );
}

export default SolutionScrollHelperComponent;
