import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

import PowerScrollHelperComponent from "../power/powerScrollHelper";
import RealtimeScrollHelperComponent from "../realtime/realtimeScrollHelper";
import SolutionScrollHelperComponent from "../solution/solutionScrollHelper";
import SettingScrollHelperComponent from "../setting/settingScrollHelper"; // ✅ 추가

function LeftMenuComponent() {
  const [hovered, setHovered] = useState(null);
  const location = useLocation();

  const linkClass =
    "w-full flex flex-col items-center space-y-1 text-white px-2 py-4 hover:bg-gray-700 transition text-sm";
  const iconStyle = "w-12 h-12";

  return (
    <div className="bg-gray-900 text-white w-24 h-full pt-16 fixed left-0 top-0 z-30 flex flex-col items-center space-y-2">
      {/* 전력 소비 */}
      <div
        onMouseEnter={() => setHovered("power")}
        onMouseLeave={() => setHovered(null)}
        className="w-full flex flex-col items-center"
      >
        <NavLink
          to="/power"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-gray-700 font-semibold" : ""}`
          }
        >
          <img src="/icons/power.png" alt="전력 소비" className={iconStyle} />
          <span>전력 소비</span>
        </NavLink>
        {(hovered === "power" || location.pathname === "/power") && (
          <div className="w-full px-2 py-2 transition-all duration-300">
            <PowerScrollHelperComponent />
          </div>
        )}
      </div>

      <hr className="w-10 border-gray-600" />

      {/* 실시간 상황 */}
      <div
        onMouseEnter={() => setHovered("realtime")}
        onMouseLeave={() => setHovered(null)}
        className="w-full flex flex-col items-center"
      >
        <NavLink
          to="/realtime"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-gray-700 font-semibold" : ""}`
          }
        >
          <img src="/icons/realtime.png" alt="실시간 상황" className={iconStyle} />
          <span>실시간 상황</span>
        </NavLink>
        {(hovered === "realtime" || location.pathname === "/realtime") && (
          <div className="w-full px-2 py-2 transition-all duration-300">
            <RealtimeScrollHelperComponent />
          </div>
        )}
      </div>

      <hr className="w-10 border-gray-600" />

      {/* 종합 분석 */}
      <div
        onMouseEnter={() => setHovered("solution")}
        onMouseLeave={() => setHovered(null)}
        className="w-full flex flex-col items-center"
      >
        <NavLink
          to="/solution"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-gray-700 font-semibold" : ""}`
          }
        >
          <img src="/icons/solution.png" alt="종합 분석" className={iconStyle} />
          <span>종합 분석</span>
        </NavLink>
        {(hovered === "solution" || location.pathname === "/solution") && (
          <div className="w-full px-2 py-2 transition-all duration-300">
            <SolutionScrollHelperComponent />
          </div>
        )}
      </div>

      <hr className="w-10 border-gray-600" />

      {/* 사용자 설정 */}
      <div
        onMouseEnter={() => setHovered("setting")}
        onMouseLeave={() => setHovered(null)}
        className="w-full flex flex-col items-center"
      >
        <NavLink
          to="/setting"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-gray-700 font-semibold" : ""}`
          }
        >
          <img src="/icons/setting.png" alt="설정" className={iconStyle} />
          <span>사용자 설정</span>
        </NavLink>
        {(hovered === "setting" || location.pathname === "/setting") && (
          <div className="w-full px-2 py-2 transition-all duration-300">
            <SettingScrollHelperComponent />
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftMenuComponent;
