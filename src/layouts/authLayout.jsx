// 📁 src/layouts/authLayout.jsx

import { useEffect, useRef, useState } from "react";

function AuthLayout() {
  const introRef = useRef(null);
  const contactRef = useRef(null);
  const systemRef = useRef(null);

  const [visibleSection, setVisibleSection] = useState("");

  useEffect(() => {
    const options = {
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-id");
          setVisibleSection(id);
        }
      });
    }, options);

    [introRef, contactRef, systemRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="h-full w-full overflow-x-hidden bg-white/10 backdrop-blur-md rounded-xl shadow-lg text-white p-4 flex flex-col">
      {/* 버튼 영역 */}
      <div className="flex justify-center space-x-3 mb-4">
        <button
          onClick={() => scrollToSection(introRef)}
          className="px-4 py-2 rounded-full border border-white/60 hover:bg-white/20 transition"
        >
          기본 소개
        </button>
        <button
          onClick={() => scrollToSection(contactRef)}
          className="px-4 py-2 rounded-full border border-white/60 hover:bg-white/20 transition"
        >
          문의하기
        </button>
        <button
          onClick={() => scrollToSection(systemRef)}
          className="px-4 py-2 rounded-full border border-white/60 hover:bg-white/20 transition"
        >
          시스템 소개
        </button>
      </div>

      {/* 스크롤 컨테이너: 세로 스크롤 + 스크롤바 왼쪽 + 좌우 스크롤 차단 */}
      <div
        className="flex-1 overflow-y-auto scroll-smooth pr-2"
        style={{ direction: "rtl", scrollbarWidth: "thin", overflowX: "hidden" }}
      >
        <div className="flex flex-col space-y-12" style={{ direction: "ltr" }}>
          {/* 기본 소개 */}
          <section
            ref={introRef}
            data-id="intro"
            className={`relative min-h-[80vh] p-6 rounded-xl transition-all duration-700 ease-out transform ${
              visibleSection === "intro" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            } bg-white/30 text-gray-900`}
          >
            <h2 className="text-2xl font-bold mb-2">기본 소개</h2>
            <p>스마트 에너지 관리 시스템 FEMSystem에 오신 걸 환영합니다.</p>
          </section>

          {/* 문의하기 */}
          <section
            ref={contactRef}
            data-id="contact"
            className={`relative min-h-[80vh] p-6 rounded-xl transition-all duration-700 ease-out transform ${
              visibleSection === "contact"
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            } bg-blue-100/30 text-gray-900`}
          >
            <h2 className="text-2xl font-bold mb-2">문의하기</h2>
            <p>문의: contact@fems.com<br />전화: 010-1234-5678</p>
          </section>

          {/* 시스템 소개 */}
          <section
            ref={systemRef}
            data-id="system"
            className={`relative min-h-[80vh] p-6 rounded-xl transition-all duration-700 ease-out transform ${
              visibleSection === "system"
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            } bg-green-100/30 text-gray-900`}
          >
            <h2 className="text-2xl font-bold mb-2">시스템 소개</h2>
            <p>전력 모니터링, 분석, 알림 시스템이 통합된 솔루션을 제공합니다.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
