import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function AuthScrollHelperComponent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("intro");

  // ✅ 현재 보이는 section 감지
  useEffect(() => {
    const sections = ["intro", "system", "contact"]; // ✅ 순서 변경됨
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            setActiveSection(id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    if (location.pathname !== "/auth") {
      navigate("/auth", { state: { scrollTo: id } });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-row space-x-2 p-2 bg-white/30 rounded-xl shadow-md backdrop-blur-sm text-gray-800 w-fit transition-all duration-300">
      {["intro", "system", "contact"].map((id) => {
        const isActive = activeSection === id;
        return (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={`px-3 py-1.5 text-sm rounded-full font-semibold shadow transition-all duration-300
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-white/50 hover:bg-white/70 text-gray-900"
              }`}
          >
            {id === "intro" ? "소개" : id === "system" ? "시스템" : "문의"}
          </button>
        );
      })}
    </div>
  );
}

export default AuthScrollHelperComponent;
