import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import DetectionLayoutComponent from "../layouts/realtime/detectionLayout";
import DonutBarLayoutComponent from "../layouts/realtime/donutBarLayout";
import LivePriceLayoutComponent from "../layouts/realtime/livePriceLayout";

function RealtimePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth" });

      // ✅ 뒤로가기 시 다시 스크롤되는 걸 방지
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 px-0">
      <section id="detection" className="pt-10">
        <h2 className="text-lg font-bold mb-4 px-4 flex items-center gap-2">
          🛑 이상 설비 감지
        </h2>
        <DetectionLayoutComponent />
      </section>

      <section id="graph" className="pt-20">
        <h2 className="text-lg font-bold mb-4 px-4 flex items-center gap-2">
          📊 설비별 비율 및 실시간 추이
        </h2>
        <DonutBarLayoutComponent />
      </section>

      <section id="price" className="pt-20">
        <h2 className="text-lg font-bold mb-4 px-4 flex items-center gap-2">
          💸 현재 전력 예상 요금
        </h2>
        <LivePriceLayoutComponent />
      </section>
    </div>
  );
}

export default RealtimePage;
