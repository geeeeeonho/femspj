import TotalPowerComponent from "../components/power/totalPower";

function PowerLayout() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">전력 사용 현황</h1>

      {/* 전체 전력 소비 그래프 컴포넌트 */}
      <TotalPowerComponent />
    </div>
  );
}

export default PowerLayout;
