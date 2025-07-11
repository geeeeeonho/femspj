import LivePriceComponent from "../../components/realtime/livePrice";

function LivePriceLayout() {
  return (
    <div className="bg-blue-50 rounded shadow p-6 flex flex-col items-center">
      <h3 className="text-base font-semibold mb-2">현재 전력 예상 요금</h3>
      <LivePriceComponent />
    </div>
  );
}

export default LivePriceLayout;

