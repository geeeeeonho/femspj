// 📄 파일: src/components/menu/leftMenu.jsx
// 📌 좌측 메뉴바 (아이콘 + 아래 텍스트 정렬)

import { NavLink } from "react-router-dom";

function LeftMenuComponent() {
  const linkClass =
    "flex flex-col items-center space-y-1 text-white px-2 py-4 hover:bg-gray-700 rounded transition text-sm";

  return (
    <aside className="bg-gray-900 text-white w-24 min-h-screen flex flex-col items-center py-4">
      {/* 메뉴 항목들 */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? "bg-gray-700 font-semibold" : ""}`
        }
      >
        <span className="text-2xl">🏠</span>
        <span>홈</span>
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? "bg-gray-700 font-semibold" : ""}`
        }
      >
        <span className="text-2xl">📘</span>
        <span>소개</span>
      </NavLink>

      <NavLink
        to="/todo"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? "bg-gray-700 font-semibold" : ""}`
        }
      >
        <span className="text-2xl">📝</span>
        <span>할 일</span>
      </NavLink>
    </aside>
  );
}

export default LeftMenuComponent;
