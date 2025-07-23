import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function RealtimeScrollHelperComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname !== "/realtime") {
      // 다른 페이지 → /realtime로 이동하면서 scrollTo 상태 전달
      navigate("/realtime", { state: { scrollTo: id } });
    } else {
      // 같은 페이지면 → 바로 스크롤
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
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
