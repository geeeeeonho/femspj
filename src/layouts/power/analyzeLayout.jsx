import AnalyzePieComponent from "../../components/power/analyzePieChart";
import AnalyzeSummaryComponent from "../../components/power/analyzeSummary"; // ← 두번째 컴포넌트

function AnalyzeLayouLayout() {
  return (
    <div className="w-full flex flex-col gap-8">
      <AnalyzePieComponent />
      <AnalyzeSummaryComponent />
    </div>
  );
}
export default AnalyzeLayouLayout;
