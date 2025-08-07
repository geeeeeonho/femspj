import React from "react";
import { useNavigate } from "react-router-dom";

const overlayItems = [
  {
    key: "power",
    label: "소비전력 파악",
    imgSrc: "/images/power-page.png",
    description: "공장 각 설비의 소비 전력을 확인할 수 있습니다.",
    path: "/power"
  },
  {
    key: "realtime",
    label: "실시간 상황 보고",
    imgSrc: "/images/realtime-page.png",
    description: "현재 공장의 실시간 전력 상태와 알람을 확인합니다.",
    path: "/realtime"
  },
  {
    key: "analysis",
    label: "종합 분석 및 개선",
    imgSrc: "/images/analysis-page.png",
    description: "이전 데이터를 기반으로 한 종합 분석 결과를 제공합니다.",
    path: "/analysis"
  },
  {
    key: "setting",
    label: "사용자 환경 설정",
    imgSrc: "/images/setting-page.png",
    description: "사용자별 알림 및 대시보드 설정을 관리합니다.",
    path: "/settings"
  }
];

export default function MainLayout({ usert = "사용자" }) {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center px-4 py-12">
      <h2 className="text-3xl font-semibold text-gray-800 mb-2 text-center">
        반갑습니다, {usert}님!
      </h2>
      <p className="text-gray-600 text-sm mb-10 text-center max-w-md">
        EASY FEMS는 사용자 친화적 인터페이스와 직관적인 데이터 시각화를 통해<br />
        스마트한 공장 에너지 관리를 지원합니다.
      </p>

      {/* 중앙 상단 공장 이미지 (사이즈 축소) */}
      <img
        src="/images/factory-center.png"
        alt="공장 이미지"
        className="w-full max-w-2xl h-auto mb-16"
      />

      {/* 네 개의 카드 일렬 배치, 전체 가로 채우기 */}
      <div className="flex flex-row justify-between gap-6 w-full max-w-full px-4">
        {overlayItems.map((item) => (
          <div
            key={item.key}
            onClick={() => navigate(item.path)}
            className="flex-1 flex flex-col items-center bg-white border-2 border-gray-200 rounded-lg p-12 cursor-pointer transform transition-transform hover:scale-105 shadow-xl"
          >
            <h3 className="text-2xl font-medium mb-6 text-gray-800">
              {item.label}
            </h3>
            <img
              src={item.imgSrc}
              alt={`${item.label} 미리보기`}
              className="flex-grow w-full h-48 mb-6 rounded object-cover"
            />
            <p className="text-gray-700 text-center text-base">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}