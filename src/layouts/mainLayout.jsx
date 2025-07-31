import React, { useState } from "react";
import MainOverlayComponent from "../components/main/mainOverLay";


function MainLayout({ usert = "사용자" }) {
  const [selectedOverlay, setSelectedOverlay] = useState(null);

  const handleSelect = (key) => {
    setSelectedOverlay(key);
  };

  const handleClose = () => {
    setSelectedOverlay(null);
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10 relative">
      {/* ✅ 상단 텍스트 */}
      <h2 className="text-xl text-gray-800 text-center mb-12 leading-relaxed font-semibold">
        환영합니다. {usert}님<br />
        <span className="font-normal text-gray-700">
          EASY FEMS는 보다 사용자 친화적인 에너지 관리, 분석에 최적화된 스마트 팩토리 시스템입니다.
        </span>
      </h2>

      {/* ✅ 중앙 영역 */}
      <div className="relative w-full max-w-7xl flex justify-center items-center">
        {/* 🔹 왼쪽 상단 버튼 */}
        <div className="absolute left-0 top-0">
          <button
            onClick={() => handleSelect("power")}
            className="w-[320px] py-4 px-6 rounded-full border-4 border-pink-600 text-gray-800 font-medium text-lg hover:bg-pink-50 transition"
          >
            소비전력 파악
          </button>
        </div>

        {/* 🔹 오른쪽 상단 버튼 */}
        <div className="absolute right-0 top-0">
          <button
            onClick={() => handleSelect("realtime")}
            className="w-[320px] py-4 px-6 rounded-full border-4 border-pink-400 text-gray-800 font-medium text-lg hover:bg-pink-50 transition"
          >
            실시간 상황 보고
          </button>
        </div>

        {/* 🔹 왼쪽 하단 버튼 */}
        <div className="absolute left-0 bottom-0">
          <button
            onClick={() => handleSelect("analysis")}
            className="w-[320px] py-4 px-6 rounded-full border-4 border-pink-400 text-gray-800 font-medium text-lg hover:bg-pink-50 transition"
          >
            종합적인 분석 및 개선 방안
          </button>
        </div>

        {/* 🔹 오른쪽 하단 버튼 */}
        <div className="absolute right-0 bottom-0">
          <button
            onClick={() => handleSelect("setting")}
            className="w-[320px] py-4 px-6 rounded-full border-4 border-pink-400 text-gray-800 font-medium text-lg hover:bg-pink-50 transition"
          >
            사용자 환경 변경
          </button>
        </div>

        {/* ✅ 중앙 공장 이미지 */}
        <img
          src="/images/factory-center.png"
          alt="공장 이미지"
          className="w-[600px] h-auto z-10"
        />
      </div>

      {/* ✅ 오버레이 설명 */}
      <MainOverlayComponent selected={selectedOverlay} onClose={handleClose} />
    </div>
  );
}

export default MainLayout;
