// 📄 파일: src/layouts/power/monthlyLayout.jsx
// 📌 월간 전력 소비 레이아웃

import MonthlyChartComponent from "../../components/power/monthlyChart";

function MonthlyLayout() {
  return (
    <section id="monthly" className="mb-12">
      <h2 className="text-xl font-bold mb-4">📆 월간 전력 소비</h2>
      <MonthlyChartComponent />
    </section>
  );
}

export default MonthlyLayout;
