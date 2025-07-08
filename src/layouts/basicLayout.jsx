import TopMenuComponent from "../components/menu/topMenu";
import LeftMenuComponent from "../components/menu/leftMenu";
import { useAlert } from "../contexts/AlertContext"; // 🔔 피크 알림 컨텍스트

function BasicLayout({ children }) {
  const { isPeak, peakTime } = useAlert(); // 컨텍스트에서 피크 상태 가져오기

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
      <main className="pl-24 pt-16 h-screen overflow-y-auto relative">
        {/* 💡 좌측 메뉴(24폭), 상단 메뉴(16높이) 여백 확보 */}

        {/* 🔔 전력 피크 알림 배너 */}
        {isPeak && (
          <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center py-2 font-bold animate-pulse z-50">
            ⚠️ 전력 피크 발생! ({peakTime} 기준)
          </div>
        )}

        <div className={isPeak ? "mt-10" : ""}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default BasicLayout;
