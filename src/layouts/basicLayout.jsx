import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import TopMenuComponent from "../components/menu/topMenu";
import LeftMenuComponent from "../components/menu/leftMenu";
import { useAlert } from "../contexts/alertContext"; // 🔔 피크 알림 컨텍스트

function BasicLayout({ children }) {
  const { isPeak, peakTime } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();

  // 배너 표시 여부
  const [showBanner, setShowBanner] = useState(true);

  // 실시간 페이지에 들어가면 자동 숨김
  useEffect(() => {
    if (location.pathname === "/realtime") {
      setShowBanner(false);
    }
  }, [location.pathname]);

  // 배너 클릭 → 실시간 페이지 위험영역 이동
  const handleAlertClick = () => {
    navigate("/realtime", { state: { scrollTo: "danger-zone" } });
  };

  // X 버튼 클릭 → 배너 숨김
  const handleCloseBanner = (e) => {
    e.stopPropagation(); // 배너 클릭 동작 막기
    setShowBanner(false);
  };

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
        {/* 🔔 전력 피크 알림 배너 */}
        {isPeak && showBanner && (
          <div
            className="fixed top-16 left-0 right-0 bg-red-600 text-white text-center py-2 font-bold animate-pulse z-50 cursor-pointer flex items-center justify-center gap-2"
            onClick={handleAlertClick}
          >
            ⚠️ 전력 피크 발생! ({peakTime} 기준) → 실시간 현황 보기
            <button
              onClick={handleCloseBanner}
              className="ml-4 px-2 py-1 bg-red-800 rounded hover:bg-red-900 text-white text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* 🔔 배너 높이만큼 여백 확보 */}
        <div className={isPeak && showBanner ? "mt-20" : ""}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default BasicLayout;
