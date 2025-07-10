// 🧩 실시간 도넛 + 막대 그래프 레이아웃
import DonutChart from "../../components/realtime/donutChart";
import BarChart from "../../components/realtime/barChart";

function DonutBarLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* 🔵 좌측: 도넛 그래프 (설비별 비율) */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">설비 라인 비율</h2>
        <DonutChart />
      </div>

      {/* 🔶 우측: 막대 그래프 (실시간 추이) */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">실시간 전력 추세</h2>
        <BarChart />
      </div>
    </div>
  );
}

export default DonutBarLayout;
