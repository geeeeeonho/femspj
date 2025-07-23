import WeeklyLayoutComponent from "../layouts/power/weeklyLayout";
import MonthlyLayoutComponent from "../layouts/power/monthlyLayout";
import CustomLayoutComponent from "../layouts/power/customLayout";


function PowerPage() {
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
