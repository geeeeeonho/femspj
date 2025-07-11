import DetectionLayout from "../layouts/realtime/detectionLayout";
import DonutBarLayout from "../layouts/realtime/donutBarLayout";
import LivePriceLayout from "../layouts/realtime/livePriceLayout";

function RealtimePage() {
  return (
    <div className="relative bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold px-4 pt-4 mb-6">⚡ 실시간 상황</h1>

      <section id="detection" className="pt-10">
        <DetectionLayout />
      </section>
      <section id="graph" className="pt-20">
        <DonutBarLayout />
      </section>
      <section id="price" className="pt-20">
        <LivePriceLayout />
      </section>
    </div>
  );
}

export default RealtimePage;
