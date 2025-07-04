// 📄 파일: src/layouts/power/weeklyLayout.jsx
// 📌 주간 전력 소비 레이아웃

import WeeklyChartComponent from "../../components/power/weeklyChart";

function WeeklyLayout() {
  return (
    <section id="weekly" className="mb-12">
      <h2 className="text-xl font-bold mb-4">📅 주간 전력 소비</h2>
      <WeeklyChartComponent />
    </section>
  );
}

export default WeeklyLayout;
