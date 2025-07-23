import React from "react";

function SolutionScrollHelperComponent() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
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
