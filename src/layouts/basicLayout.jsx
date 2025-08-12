// 📁 src/layouts/basicLayout.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TopMenuComponent from "../components/menu/topMenu";
import LeftMenuComponent from "../components/menu/leftMenu";
// 리눅스: 실제 파일명이 alertContext.jsx면 아래 경로도 소문자로 맞추세요.
import { useAlert } from "../contexts/alertContext";

function BasicLayout({ children }) {
  const { isPeak, peakTime } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();

  const isOnRealtime = location.pathname === "/realtime";

  // 이벤트 키: 시간 기준 (백엔드가 시간 바꿔 내려주면 새 이벤트로 간주)
  const eventKey = isPeak ? `peak@${peakTime ?? ""}` : "";

  // 배너 닫힘 상태
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const lastEventKeyRef = useRef("");

  // 초기/이벤트 변경 시: 세션 스토리지에서 닫힘 상태 복원
  useEffect(() => {
    if (eventKey !== lastEventKeyRef.current) {
      lastEventKeyRef.current = eventKey;
      const dismissedKey = sessionStorage.getItem("dismissedPeakEventKey") || "";
      setBannerDismissed(!!eventKey && dismissedKey === eventKey ? true : false);
    }
  }, [eventKey]);

  const persistDismiss = () => {
    if (eventKey) sessionStorage.setItem("dismissedPeakEventKey", eventKey);
    setBannerDismissed(true);
  };

  // 배너 클릭: 실시간으로 이동(이미 그 페이지면 닫기만)
  const handleAlertClick = () => {
    if (isOnRealtime) {
      persistDismiss();
      return;
    }
    persistDismiss();
    navigate("/realtime", { state: { scrollTo: "danger-zone" } });
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
