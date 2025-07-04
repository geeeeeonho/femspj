import WeeklyLayout from "../layouts/power/weeklyLayout";
import MonthlyLayout from "../layouts/power/monthlyLayout";
import AnalyzeLayout from "../layouts/power/analyzeLayout";
import ScrollHelperComponent from "../components/power/scrollHelper";

function PowerPage() {
  return (
    <div className="relative">
      <ScrollHelperComponent />

      <section id="weekly" className="pt-20">
        <WeeklyLayout />
      </section>
      <section id="monthly" className="pt-20">
        <MonthlyLayout />
      </section>
      <section id="analyze" className="pt-20">
        <AnalyzeLayout />
      </section>
    </div>
  );
}

export default PowerPage;