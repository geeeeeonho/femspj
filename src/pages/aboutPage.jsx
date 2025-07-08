// 📄 파일: src/pages/about.jsx
// ℹ️ Easy FEMS 소개 페이지 (전체 메뉴 설명 포함)

function AboutPage() {
  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* 소개 박스 */}
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center mb-4">
          <img src="/icons/fems.png" alt="FEMS 소개" className="w-10 h-10 mr-3" />
          <h1 className="text-2xl font-semibold">Easy FEMS란?</h1>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Easy FEMS는 기존 FEMS 시스템보다 <strong>간편하고 직관적</strong>인 사용자 경험을 목표로 개발된
          <span className="text-blue-600 font-semibold"> 에너지 관리 솔루션</span>입니다.
          실시간으로 전력 기준치 초과 상황을 감지하며, 알림 기능을 통해
          <strong> 빠르게 대응</strong>할 수 있습니다.
        </p>
      </div>

      {/* 전력 소비 설명 */}
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center mb-4">
          <img src="/icons/power.png" alt="전력소비 아이콘" className="w-10 h-10 mr-3" />
          <h2 className="text-xl font-semibold">📊 전력 소비 메뉴</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          이 메뉴에서는 <strong>전체 전력 사용량</strong>과 <strong>설비 라인별 전력 소비</strong>를 시각적으로 분석할 수 있습니다.
          일간, 주간, 월간 단위의 통계 자료를 확인할 수 있으며, 향후에는 AI 기반 예측 기능도 제공될 예정입니다.
        </p>
      </div>

      {/* 실시간 상황 설명 */}
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center mb-4">
          <img src="/icons/realtime.png" alt="실시간 아이콘" className="w-10 h-10 mr-3" />
          <h2 className="text-xl font-semibold">⏱ 실시간 상황 메뉴</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          실시간 상황 메뉴에서는 <strong>5분 간격으로 업데이트되는 전력 데이터</strong>를 통해,
          현재 공장의 상태를 빠르게 파악할 수 있습니다.
          이상 징후가 감지될 경우 <strong>시각적 알림</strong>으로 즉시 대응할 수 있어 운영의 민첩성을 높입니다.
        </p>
      </div>

      {/* 스마트 솔루션 설명 */}
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center mb-4">
          <img src="/icons/solution1.png" alt="솔루션 아이콘" className="w-10 h-10 mr-3" />
          <h2 className="text-xl font-semibold">🧠 스마트 솔루션 메뉴</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          스마트 솔루션 메뉴는 축적된 데이터를 기반으로 <strong>가장 적합한 절감 방법</strong>을 제안합니다.
          각 설비별 소비 특성을 분석하고, <strong>사용자가 직접 개선안을 실험</strong>할 수 있는 기능도 확장 예정입니다.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
