import TopMenuComponent from "../components/menu/topMenu";
import LeftMenuComponent from "../components/menu/leftMenu";

function BasicLayout({ children }) {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* ✅ 상단 메뉴: 전체 가로 너비 */}
      <TopMenuComponent />

      {/* ✅ 아래쪽: 좌측 메뉴 + 메인 콘텐츠 */}
      <div className="flex flex-1">
        <LeftMenuComponent />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default BasicLayout;
