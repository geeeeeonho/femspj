import { useNavigate, useLocation } from "react-router-dom";

function AuthScrollHelperComponent() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    if (location.pathname !== "/auth") {
      navigate("/auth", { state: { scrollTo: id } });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col space-y-3 p-4 bg-white/70 rounded-xl shadow-md backdrop-blur-sm text-gray-800 w-40">
      {["intro", "contact", "system"].map((id) => (
        <button
          key={id}
          onClick={() => scrollToSection(id)}
          className="w-full px-4 py-2 rounded-full bg-white hover:bg-gray-100 font-semibold shadow transition"
        >
          {id === "intro" ? "소개" : id === "contact" ? "문의" : "시스템"}
        </button>
      ))}
    </div>
  );
}

export default AuthScrollHelperComponent;
