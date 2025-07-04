// 📄 파일: src/layouts/power/analyzeLayout.jsx
// 📌 전력 소비 분석 레이아웃

import AnalyzeChartComponent from "../../components/power/analyzePieChart";
import AnalyzeSummaryComponent from "../../components/power/analyzeSummary";

function AnalyzeLayout() {
  return (
    <section id="analyze" className="mb-12">
      <h2 className="text-xl font-bold mb-4">📊 전력 소비 분석</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <AnalyzeChartComponent />
        </div>
        <div className="w-full md:w-1/2">
          <AnalyzeSummaryComponent />
        </div>
      </div>
    </section>
  );
}

export default AnalyzeLayout;
