import AnalyzeLayoutComponent from "../layouts/solution/analyzeLayout";

function SolutionPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-0">
      <section id="summary" className="pt-10">
        <h2 className="text-lg font-bold mb-4 px-4 flex items-center gap-2">
          🔎 분석 요약
        </h2>
        <AnalyzeLayoutComponent />
      </section>
    </div>
  );
}

export default SolutionPage;
