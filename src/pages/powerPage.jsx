// 📄 파일: src/pages/powerPage.jsx
import WeeklyLayout from "../layouts/power/weeklyLayout";
import MonthlyLayout from "../layouts/power/monthlyLayout";
import AnalyzeLayout from "../layouts/power/analyzeLayout";

function PowerPage() {
  return (
    <div className="overflow-y-auto max-h-[calc(100vh-64px)] px-4 py-8 space-y-16 scroll-smooth">
    {/* 🟠 주간 */}
    <section id="weekly">
        <WeeklyLayout />
    </section>

    {/* 🟢 월간 */}
    <section id="monthly">
        <MonthlyLayout />
    </section>

    {/* 🔵 분석 */}
    <section id="analyze">
        <AnalyzeLayout />
    </section>
    </div>
  );
}

export default PowerPage;

