// 📄 파일: src/pages/solutionPage.jsx

import AnalyzeLayoutComponent from "../layouts/solution/analyzeLayout";
import LineOrderLayoutComponent from "../layouts/solution/lineOrderLayout";
import WorkSimulatorLayoutComponent from "../layouts/solution/workSimulatorLayout";

function SolutionPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-0">
      {/* 분석 요약 섹션 */}
      <section id="summary" className="pt-10">
        <h2 className="text-lg font-bold mb-4 px-4 flex items-center gap-2">
          🔎 분석 요약
        </h2>
        <AnalyzeLayoutComponent />
      </section>

      {/* 제품별 설비 순서 입력 섹션 */}
      <section id="lineOrder" className="pt-20">
        <h2 className="text-lg font-bold mb-4 px-4 flex items-center gap-2">
          📦 제품별 설비 순서 입력
        </h2>
        <LineOrderLayoutComponent />
      </section>

      {/* 작업시간 조정 시뮬레이션 섹션 */}
      <section id="workSim" className="pt-20 pb-10">
        <h2 className="text-lg font-bold mb-4 px-4 flex items-center gap-2">
          ⏱ 작업시간 조정 시뮬레이션
        </h2>
        <WorkSimulatorLayoutComponent />
      </section>
    </div>
  );
}

export default SolutionPage;
