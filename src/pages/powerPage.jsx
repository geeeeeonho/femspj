// 📄 src/pages/PowerPage.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import WeeklyLayoutComponent from "../layouts/power/weeklyLayout";
import MonthlyLayoutComponent from "../layouts/power/monthlyLayout";
import CustomLayoutComponent from "../layouts/power/customLayout";

function PowerPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth" });

      // ✅ URL state 초기화 (뒤로 가기 시 다시 스크롤되지 않게)
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="relative">
      <section id="weekly" className="pt-10">
        <h2 className="text-lg font-bold mb-4 px-4">📊 주간 전력 소비</h2>
        <WeeklyLayoutComponent />
      </section>

      <section id="monthly" className="pt-20">
        <h2 className="text-lg font-bold mb-4 px-4">📆 월간 전력 소비</h2>
        <MonthlyLayoutComponent />
      </section>

      <section id="custom" className="pt-20">
        <h2 className="text-lg font-bold mb-4 px-4">🧩 선택 구간 분석</h2>
        <CustomLayoutComponent />
      </section>
    </div>
  );
}

export default PowerPage;
