// src/pages/powerPage.jsx

import WeeklyLayoutComponent from "../layouts/power/weeklyLayout";
import MonthlyLayoutComponent from "../layouts/power/monthlyLayout";
import AnalyzeLayoutComponent from "../layouts/power/analyzeLayout";
import ScrollHelperComponent from "../components/power/scrollHelper";

function PowerPage() {
  return (
    <div className="relative">
      <ScrollHelperComponent />

      <section id="weekly" className="pt-10">
        <h2 className="text-lg font-bold mb-4 px-4">📊 주간 전력 소비</h2>
        <WeeklyLayoutComponent />
      </section>
      <section id="monthly" className="pt-20">
        <h2 className="text-lg font-bold mb-4 px-4">📆 월간 전력 소비</h2>
        <MonthlyLayoutComponent />
      </section>
      <section id="analyze" className="pt-20">
        <h2 className="text-lg font-bold mb-4 px-4">🔎 전력 소비 분석</h2>
        <AnalyzeLayoutComponent />
      </section>
    </div>
  );
}
export default PowerPage;
