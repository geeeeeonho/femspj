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
    <nav className="bg-gray-800 p-4 w-full">
      <div className="flex justify-between items-center">
        {/* 로고 클릭 시 메인(/)으로 이동 */}
        <NavLink to="/" className="text-white font-bold text-lg hover:underline">
          Easy FEMS
        </NavLink>

        <div className="space-x-6">
          <NavLink to="/about" className="text-white hover:underline">
            소개
          </NavLink>
          <button onClick={handleLogout} className="text-white hover:underline">
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  );
}

export default TopMenuComponent;
