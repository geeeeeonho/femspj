// 📁 src/pages/SolutionPage.jsx

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import LivePriceLayoutComponent from "../layouts/solution/livePriceLayout";
import WorkSimulatorLayout from "../layouts/solution/workSimulatorLayout";

function SolutionPage() {
  const location = useLocation();

  useEffect(() => {
    // 페이지 진입 후 스크롤
    const scrollTo = location.state?.scrollTo;
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100); // 렌더링 완료 후 살짝 지연
      }
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-50 px-0">
      {/* 👉 오른쪽 고정 도우미 제거됨 */}

      
      <section id="price" className="pt-20">
        <h2 className="text-lg font-bold mb-4 px-4 flex items-center gap-2">
          💸 현재 전력 예상 요금
        </h2>
        <LivePriceLayoutComponent />
      </section>

      <section id="simulator" className="pt-20">
        <h2 className="text-lg font-bold mb-4 px-4 flex items-center gap-2">
          ⏱ 작업시간 조정 시뮬레이션
        </h2>
        <WorkSimulatorLayout />
      </section>
    </div>
  );
}

export default SolutionPage;
