// 📁 components/main/mainOverlay.jsx

import React from "react";

function MainOverlayComponent({ selected, onClose }) {
  if (!selected) return null;

  const overlayContent = {
    power: {
      title: "소비전력 파악",
      desc: "설비별 전력 사용량, 추세 분석 등을 통해 에너지 소비를 명확히 파악할 수 있습니다.",
    },
    realtime: {
      title: "실시간 상황 보고",
      desc: "현재 공장의 에너지 흐름, 알림 발생 여부, 피크 사용률을 실시간으로 확인할 수 있습니다.",
    },
    analysis: {
      title: "종합적인 분석 및 개선 방안",
      desc: "월별 분석, 예측 모델, 개선 시나리오를 통해 에너지 효율성을 높일 수 있습니다.",
    },
    setting: {
      title: "사용자 환경 변경",
      desc: "계정 정보, 시각화 테마, 알림 옵션 등을 사용자가 직접 설정할 수 있습니다.",
    },
  };

  const { title, desc } = overlayContent[selected] || {};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="bg-white rounded-xl p-8 w-[480px] max-w-full shadow-xl text-gray-800 animate-slide-in"
      >
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ×
          </button>
        </div>
        <p className="mt-4">{desc}</p>
      </div>

      {/* ✅ 애니메이션을 위한 Tailwind 추가 */}
      <style>
        {`
          .animate-slide-in {
            animation: slideIn 0.4s ease-out forwards;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(${["power", "analysis"].includes(selected) ? "-30px" : "30px"});
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default MainOverlayComponent;
