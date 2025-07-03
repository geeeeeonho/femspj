// React 컴포넌트 파일: basicLayout 컴포넌트 기능
/*
  파일: basicLayout.jsx
  설명:
  - TopMenu (상단 메뉴) + LeftMenu (사이드 메뉴) + children(본문)
  - LeftMenu는 fixed로 항상 왼쪽에 고정
  - TopMenu는 상단 고정
  - children은 ml-64로 왼쪽 여백 확보
*/

import TopMenuComponent from "../components/menu/topMenu";
import LeftMenuComponent from "../components/menu/leftMenu";

function BasicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 사이드바 */}
      <div className="w-64 h-screen bg-gray-800 text-white fixed top-0 left-0 flex flex-col shadow-lg z-20">
        {/* 로고 */}
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Easy FEMS
        </div>

        {/* 메뉴 */}
        <LeftMenuComponent />

        {/* 하단 정보 */}
        <div className="p-4 border-t border-gray-700 text-sm mt-auto">
          ⓒ 2025 Easy FEMS
        </div>
      </div>

      {/* 전체 오른쪽 화면: 상단 + 본문 */}
      <div className="ml-64">
        {/* 상단 탑 메뉴 */}
        <TopMenuComponent />

        {/* 본문 */}
        <div className="container mx-auto py-6 px-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default BasicLayout;
