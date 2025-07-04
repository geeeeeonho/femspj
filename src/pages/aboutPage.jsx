function AboutPage() {
  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* 소개 박스 */}
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center mb-4">
          <img src="/icons/solution.png" alt="FEMS 소개" className="w-10 h-10 mr-3" />
          <h1 className="text-2xl font-semibold">Easy FEMS란?</h1>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Easy FEMS는 기존 FEMS 시스템보다 <strong>간편하고 직관적</strong>인 사용자 경험을 목표로 개발된
          <span className="text-blue-600 font-semibold"> 에너지 관리 솔루션</span>입니다.
          실시간으로 전력 기준치 초과 상황을 감지하며, 알림 기능을 통해
          <strong> 빠르게 대응</strong>할 수 있습니다.
        </p>
      </div>

      {/* 메뉴 설명 박스 */}
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center mb-4">
          <img src="/icons/power.png" alt="전력소비 아이콘" className="w-10 h-10 mr-3" />
          <h2 className="text-xl font-semibold">📊 전력 소비 메뉴</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          이 메뉴에서는 <strong>전체 전력 사용량</strong>과 <strong>설비 라인별 전력 소비</strong>를 시각적으로 분석할 수 있습니다.
          추후에는 주간/월간/AI 기반 예측 분석 등 다양한 기능이 포함됩니다.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
