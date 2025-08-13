// 📁 layouts/realtime/donutBarLayout.jsx
import BarChartComponent from "../../components/realtime/barChart";

function DonutBarLayoutComponent() {
  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow p-6">
        <BarChartComponent />
      </div>
    </div>
  );
}

export default DonutBarLayoutComponent;
