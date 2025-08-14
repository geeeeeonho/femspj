// 📁 src/layouts/basicLayout.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TopMenuComponent from "../components/menu/topMenu";
import LeftMenuComponent from "../components/menu/leftMenu";
// 리눅스: 실제 파일명이 alertContext.jsx면 아래 경로도 소문자로 맞추세요.
import { useAlert } from "../contexts/alertContext";

const DISMISS_KEY = "dismissedPeakActive"; // 이번 피크 이벤트(= isPeak true) 동안 유효

function BasicLayout({ children }) {
  const { isPeak, peakTime } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();

  const isOnRealtime = location.pathname === "/realtime";

  // 배너 닫힘 상태 (세션 단위)
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // isPeak 변화에 따라 닫힘 상태 복원/초기화
  useEffect(() => {
    if (isPeak) {
      // 피크 진행 중: 이전에 닫았으면 계속 닫힘 유지
      const dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
      setBannerDismissed(dismissed);
    } else {
      // 피크 종료: 다음 이벤트를 위해 닫힘 플래그 초기화
      sessionStorage.removeItem(DISMISS_KEY);
      setBannerDismissed(false);
    }
  }, [isPeak]);

  const persistDismiss = () => {
    // 이번 피크 이벤트 진행 중엔 계속 닫힌 상태 유지
    sessionStorage.setItem(DISMISS_KEY, "1");
    setBannerDismissed(true);
  };

  // 배너 클릭: 실시간으로 이동(이미 그 페이지면 닫기만)
  const handleAlertClick = () => {
    persistDismiss();
    if (!isOnRealtime) {
      navigate("/realtime", { state: { scrollTo: "danger-zone" } });
    }
  };

  // X 버튼: 닫기만 (이벤트 동안 유지)
  const handleBannerClose = (e) => {
    e.stopPropagation();
    persistDismiss();
  };

  const showBanner = isPeak && !bannerDismissed && !isOnRealtime;

  return (
    <div className="h-screen bg-gray-100">
      {/* 상단 메뉴 */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <TopMenuComponent />
      </header>

      {/* 좌측 메뉴 */}
      <aside className="fixed top-16 left-0 z-40">
        <LeftMenuComponent />
      </aside>

      {/* 콘텐츠 */}
      <main className="pl-24 pt-16 h-screen overflow-y-auto relative">
        {/* 피크 배너 */}
        {showBanner && (
          <div
            className="fixed top-16 left-0 right-0 bg-red-600 text-white text-center py-2 font-bold animate-pulse z-50 cursor-pointer"
            onClick={handleAlertClick}
          >
            <div className="relative">
              <span>⚠️ 전력 피크 발생! ({peakTime} 기준) → 실시간 현황 보기</span>
              <button
                type="button"
                aria-label="알림 닫기"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/90 hover:text-white"
                onClick={handleBannerClose}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* 배너 공간 확보 */}
        <div className={showBanner ? "mt-20" : ""}>{children}</div>
      </main>
    </div>
  );
}

export default BasicLayout;
