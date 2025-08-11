import DonutChartComponent from "../../components/realtime/donutChart";
import BarChartComponent from "../../components/realtime/barChart";

function DonutBarLayoutComponent() {
  return (
    <div className="grid grid-cols-10 gap-6 w-full">
      <div className="bg-white rounded-xl shadow p-6 col-span-10 md:col-span-3 flex flex-col">
        <DonutChartComponent />
      </div>
      <div className="bg-white rounded-xl shadow p-6 col-span-10 md:col-span-7 flex flex-col">
        <BarChartComponent />
      </div>
    </div>
  );
}
export default DonutBarLayoutComponent;
