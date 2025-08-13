// 📁 src/layouts/power/customLayout.jsx
import CustomChartUpComponent from "../../components/power/customChartUp";
import CustomChartDownComponent from "../../components/power/customChartDown";
import { PowerChartCustomProvider, usePowerChartCustom } from "../../contexts/powerChartCustomContext"; // ★ 새 컨텍스트

// 요일 계산 유틸 (Down이 weekday를 기대하므로 여기서 붙여서 내려줌)
function toWeekdayKOR(ymd) {
  const d = new Date(ymd);
  const wk = d.getDay(); // 0~6 (일~토)
  return ["일", "월", "화", "수", "목", "금", "토"][wk] ?? "";
}

// 컨텍스트를 실제로 소비하는 내부 바디
function CustomBody() {
  const { ready, dailyRows } = usePowerChartCustom();
  // dailyRows = 현재 선택 범위의 일자 데이터 [{date, power, price}]
  const visibleData = (dailyRows ?? []).map((r) => ({
    ...r,
    weekday: toWeekdayKOR(r.date),
  }));

  if (!ready) {
    return (
      <div className="w-full bg-white p-4 rounded shadow">
        <div className="h-72 bg-gray-100 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white p-4 rounded shadow">
        {/* 상단 차트: 범위/보기모드/브러시는 컨텍스트로 동작 */}
        <CustomChartUpComponent />
        {/* 하단 표: 선택 구간의 일일 데이터 Top 7 */}
        <CustomChartDownComponent visibleData={visibleData} />
      </div>
    </div>
  );
}

function CustomLayoutComponent() {
  return (
    <PowerChartCustomProvider defaultDays={60} dailyLimit={2000}>
      <CustomBody />
    </PowerChartCustomProvider>
  );
}

export default CustomLayoutComponent;
