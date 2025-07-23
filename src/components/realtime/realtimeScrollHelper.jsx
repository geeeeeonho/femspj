import React from "react";

function RealtimeScrollHelperComponent() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full flex flex-col items-center px-2 divide-y divide-gray-600 text-white text-sm">
      <button
        onClick={() => scrollToSection("detection")}
        className="w-full px-3 py-2 text-left hover:bg-[rgba(255,255,255,0.1)] transition"
      >
        이상 감지
      </button>
      <button
        onClick={() => scrollToSection("graph")}
        className="w-full px-3 py-2 text-left hover:bg-[rgba(255,255,255,0.1)] transition"
      >
        그래프
      </button>
      <button
        onClick={() => scrollToSection("price")}
        className="w-full px-3 py-2 text-left hover:bg-[rgba(255,255,255,0.1)] transition"
      >
        요금 알림
      </button>
    </div>
  );
}

export default RealtimeScrollHelperComponent;
