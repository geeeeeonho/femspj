import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PowerScrollHelperComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname !== "/power") {
      navigate("/power", { state: { scrollTo: id } });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col items-center divide-y divide-gray-600 text-white text-sm">
      <button
        onClick={() => scrollToSection("weekly")}
        className="w-full py-2 text-center hover:bg-[rgba(255,255,255,0.1)] transition"
      >
        주간
      </button>
      <button
        onClick={() => scrollToSection("monthly")}
        className="w-full py-2 text-center hover:bg-[rgba(255,255,255,0.1)] transition"
      >
        월간
      </button>
      <button
        onClick={() => scrollToSection("custom")}
        className="w-full py-2 text-center hover:bg-[rgba(255,255,255,0.1)] transition"
      >
        선택
      </button>
    </div>
  );
}

export default PowerScrollHelperComponent;
