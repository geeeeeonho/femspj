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
          <h2 className="text-xl font-semibold">📊 전력 소비</h2>
        </div>
        <ul className="text-gray-700 leading-relaxed list-disc list-inside space-y-1">
          <li>전체 공장의 일간·주간·월간 전력 사용량을 한눈에 확인</li>
          <li>설비 라인별 전력 소비 비중을 도넛／막대 그래프로 시각화</li>
          <li>필요 시 CSV 다운로드 및 보고서 생성 기능 지원</li>
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
          <h2 className="text-xl font-semibold">⏱ 실시간 상황</h2>
        </div>
        <ul className="text-gray-700 leading-relaxed list-disc list-inside space-y-1">
          <li>5분 단위로 갱신되는 전력 데이터 스트림</li>
          <li>기준치 초과 시 실시간 팝업 알림 및 색상 경고 표시</li>
          <li>이상 징후 발생 설비로 바로 이동하는 스크롤·네비게이션 버튼</li>
        </ul>
      </div>

      {/* 종합 분석 메뉴 */}
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center mb-4">
          <img
            src="/icons/analysis.png"
            alt="종합 분석 아이콘"
            className="w-10 h-10 mr-3"
          />
          <h2 className="text-xl font-semibold">📈 종합 분석</h2>
        </div>
        <ul className="text-gray-700 leading-relaxed list-disc list-inside space-y-1">
          <li>축적된 전력 데이터 기반의 트렌드 분석 및 이상 패턴 탐지</li>
          <li>AI 예측 모델을 통한 미래 전력 수요 예측 (베타)</li>
          <li>기간별 비교 차트, 상관관계 히트맵 등 고급 시각화 도구 제공</li>
        </ul>
      </div>

      {/* 사용자 설정 메뉴 */}
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center mb-4">
          <img
            src="/icons/settings.png"
            alt="사용자 설정 아이콘"
            className="w-10 h-10 mr-3"
          />
          <h2 className="text-xl font-semibold">⚙️ 사용자 설정</h2>
        </div>
        <ul className="text-gray-700 leading-relaxed list-disc list-inside space-y-1">
          <li>알림 기준(임계값) 및 알림 채널(이메일/SMS) 설정</li>
          <li>대시보드 레이아웃 커스터마이징 및 즐겨찾기 패널 관리</li>
          <li>계정 정보·권한 관리, 외부 시스템 연동(API 키) 설정</li>
        </ul>
      </div>
    </div>
  );
}

export default AboutPage;
