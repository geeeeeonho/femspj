// 파일: src/pages/main.jsx
// 홈 메인 페이지 (ubaa8두 로그인 후 복사적으로 이용)

import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const services = [
  {
    title: "전력 소비 분석",
    desc: "전력 사용 추이를 시각화된 그래프로 확인하고, 피크 사용일을 한눈에 파악하세요.",
    icon: "/icons/power1.png",
    path: "/power",
  },
  {
    title: "실시간 모니터링",
    desc: "5분 단위로 갱신되는 데이터를 통해 공장 상황을 실시간으로 점검할 수 있습니다.",
    icon: "/icons/realtime1.png",
    path: "/realtime",
  },
  {
    title: "스마트 솔루션 적용",
    desc: "누적 데이터를 기반으로 최적의 에너지 절감 솔루션을 탐색하고 적용해보세요.",
    icon: "/icons/solution1.png",
    path: "/solution",
  },
];

function MainPage() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="px-6 py-16">
      {/* 환영 인사 */}
      <h2 className="text-xl font-semibold mb-2">👋 {user?.name ?? "고객"}님, 환영합니다!</h2>
      <p className="text-gray-700 mb-10">easy FEMS는 쉽고 직관적인 에너지 분석 및 솔루션 시스템입니다.</p>

      {/* 기능 카드 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((svc) => (
          <div
            key={svc.title}
            onClick={() => navigate(svc.path)}
            className="bg-white cursor-pointer p-6 rounded-xl shadow border border-gray-100 transition duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-50"
          >
            <img
              src={svc.icon}
              alt={svc.title}
              className="w-full max-w-[120px] h-auto mb-4 mx-auto"
            />
            <h3 className="text-lg font-bold mb-2 text-center">{svc.title}</h3>
            <p className="text-sm text-gray-600 leading-snug text-center whitespace-pre-line">{svc.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainPage;
