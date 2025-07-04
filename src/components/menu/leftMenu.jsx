// 📄 파일: src/components/menu/leftMenu.jsx
// 📌 좌측 메뉴바 (적당한 크기의 이미지 + 작은 설명 텍스트)

import { NavLink } from "react-router-dom";

function LeftMenuComponent() {
  const linkClass =
    "flex flex-col items-center space-y-1 text-white px-2 py-4 hover:bg-gray-700 rounded transition text-sm";

  const iconStyle = "w-12 h-12"; // ✅ 이미지 크기 약간 키움 (48x48px)

  return (
    <aside className="bg-gray-900 text-white w-24 min-h-screen flex flex-col items-center py-4 space-y-4">
      {/* 전력 소비 분석 메뉴 */}
      <NavLink
        to="/power"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? "bg-gray-700 font-semibold" : ""}`
        }
      >
        <img src="/icons/power.png" alt="전력 소비" className={iconStyle} />
        <span>전력 소비</span>
      </NavLink>

      {/* 구분선 */}
      <hr className="w-10 border-gray-600" />

      {/* 실시간 상황 메뉴 (활성화된 NavLink) */}
      <NavLink
        to="/realtime"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? "bg-gray-700 font-semibold" : ""}`
        }
      >
        <img
          src="/icons/realtime.png"
          alt="실시간 상황"
          className={iconStyle}
        />
        <span>실시간 상황</span>
      </NavLink>
    </aside>
  );
}

export default LeftMenuComponent;
