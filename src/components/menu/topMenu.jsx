import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

function TopMenuComponent() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    // ✅ 전체 너비로 가도록 width 설정 X
    <nav className="bg-gray-800 p-4 w-full">
      <div className="flex justify-between items-center">
        <div className="text-white font-bold text-lg">Easy FEMS</div>
        <div className="space-x-6">
          <NavLink to="/about" className="text-white hover:underline">소개</NavLink>
          <button onClick={handleLogout} className="text-white hover:underline">로그아웃</button>
        </div>
      </div>
    </nav>
  );
}

export default TopMenuComponent;
