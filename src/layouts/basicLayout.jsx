import TopMenuComponent from "../components/menu/topMenu";
import LeftMenuComponent from "../components/menu/leftMenu";

function BasicLayout({ children }) {
  return (
    <div className="h-screen bg-gray-100">
      {/* ✅ 상단 고정 메뉴 */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <TopMenuComponent />
      </header>

      {/* ✅ 좌측 고정 사이드 메뉴 */}
      <aside className="fixed top-16 left-0 z-40">
        <LeftMenuComponent />
      </aside>

      {/* ✅ 콘텐츠 영역 */}
      <main className="pl-24 pt-16 h-screen overflow-y-auto">
        {/* 💡 좌측 메뉴(24폭), 상단 메뉴(16높이) 여백 확보 */}
        {children}
      </main>
    </div>
  );
}

export default BasicLayout;
