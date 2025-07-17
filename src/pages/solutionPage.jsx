import ScrollHelperComponent from "../components/solution/scrollHelper";
import AnalyzeLayoutComponent from "../layouts/solution/analyzeLayout";
import LineOrderLayout from "../layouts/solution/lineOrderLayout";
import WorkSimulatorLayout from "../layouts/solution/workSimulatorLayout";

function SolutionPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-0">
      <ScrollHelperComponent /> {/* 스크롤 도우미 추가 */}

      <section id="summary" className="pt-10">
        <h2 className="text-lg font-bold mb-4 px-4 flex items-center gap-2">
          🔎 분석 요약
        </h2>
        <AnalyzeLayoutComponent />
      </section>

      <section id="line-order" className="pt-20">
        <h2 className="text-lg font-bold mb-4 px-4 flex items-center gap-2">
          📦 제품별 설비 순서 입력
        </h2>
        <LineOrderLayout />
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
