// 📄 파일: src/pages/about.jsx
// ℹ️ Easy FEMS 소개 페이지 (4대 메뉴 및 기능 설명, 줄바꿈 적용)

function AboutPage() {
  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* 전력 소비 메뉴 */}
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center mb-4">
          <img
            src="/icons/power.png"
            alt="전력 소비 아이콘"
            className="w-10 h-10 mr-3"
          />
          <h2 className="text-xl font-semibold">전력 소비</h2>
        </div>
        <ul className="text-gray-700 leading-relaxed list-disc list-inside space-y-1">
          <li>일·주·월 단위의 전력 사용량을 그래프와 표로 확인</li>
          <li>설비 라인별·설비별 전력 사용 비중을 도넛/막대 그래프로 시각화</li>
          <li>기간 선택(DatePicker) 및 구간별 데이터 비교 기능 제공</li>
        </ul>
      </div>

      {/* 실시간 상황 메뉴 */}
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center mb-4">
          <img
            src="/icons/realtime.png"
            alt="실시간 상황 아이콘"
            className="w-10 h-10 mr-3"
          />
          <h2 className="text-xl font-semibold">실시간 상황</h2>
        </div>
        <ul className="text-gray-700 leading-relaxed list-disc list-inside space-y-1">
          <li>설비별 실시간 전력 사용량 추세를 5분 단위로 자동 갱신</li>
          <li>피크 발생 시 상단 경고 배너 표시 및 위험 구역으로 바로 이동</li>
          <li>실시간 도넛 차트로 현재 사용률과 여유 용량 확인</li>
        </ul>
      </div>

      {/* 종합 분석 메뉴 */}
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center mb-4">
          <img
            src="/icons/solution.png"
            alt="종합 분석 아이콘"
            className="w-10 h-10 mr-3"
          />
          <h2 className="text-xl font-semibold">종합 분석</h2>
        </div>
        <ul className="text-gray-700 leading-relaxed list-disc list-inside space-y-1">
          <li>축적된 전력 데이터를 기반으로 장기 트렌드 및 패턴 분석</li>
          <li>선택 구간에 따른 설비별 전력 랭킹과 상관관계 분석 제공</li>
          <li>AI 기반 예측으로 향후 전력 수요를 미리 파악</li>
        </ul>
      </div>

      {/* 사용자 설정 메뉴 */}
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center mb-4">
          <img
            src="/icons/setting.png"
            alt="사용자 설정 아이콘"
            className="w-10 h-10 mr-3"
          />
          <h2 className="text-xl font-semibold">사용자 설정</h2>
        </div>
        <ul className="text-gray-700 leading-relaxed list-disc list-inside space-y-1">
          <li>알림 기준(임계값) 및 전송 채널(이메일/SMS) 설정</li>
          <li>전력 유형, 대시보드 레이아웃 및 즐겨찾기 패널 관리</li>
          <li>계정·권한 관리 및 외부 API 연동 설정</li>
        </ul>
      </div>
    </div>
  );
}

export default AboutPage;
