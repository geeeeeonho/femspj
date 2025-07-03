// React 컴포넌트 파일: leftMenuComponent
/*
  설명:
  - 사이드바 내에서 페이지 간 이동을 위한 메뉴입니다.
  - NavLink를 사용하여 새로고침 없이 SPA 전환됩니다.
*/

import { NavLink } from "react-router-dom"; // ✅ 꼭 react-router-dom에서 가져와야 함!

function LeftMenuComponent() {
  const linkClass =
    "flex items-center space-x-2 text-white px-4 py-2 hover:bg-gray-700 rounded transition";

  return (
    <nav className="flex-1 p-4 space-y-2">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? "bg-gray-700 font-semibold" : ""}`
        }
      >
        <span>🏠</span>
        <span>홈</span>
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? "bg-gray-700 font-semibold" : ""}`
        }
      >
        <span>📘</span>
        <span>소개</span>
      </NavLink>

      <NavLink
        to="/todo"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? "bg-gray-700 font-semibold" : ""}`
        }
      >
        <span>📝</span>
        <span>할 일</span>
      </NavLink>
    </nav>
  );
}

export default LeftMenuComponent;
