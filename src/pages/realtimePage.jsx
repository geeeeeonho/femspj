// 📄 실시간 페이지: Donut + Bar 레이아웃 포함
import DonutBarLayout from "../layouts/realtime/donutBarLayout";

function RealtimePage() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-6 px-4 pt-4">⚡ 실시간 상황</h1>
      <DonutBarLayout />
    </div>
  );
}

export default RealtimePage;
