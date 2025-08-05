import { useEffect, useRef, useState } from "react";

function AuthLayout() {
  const introRef = useRef(null);
  const contactRef = useRef(null);
  const systemRef = useRef(null);

  const [visibleSection, setVisibleSection] = useState("intro");

  useEffect(() => {
    const options = {
      threshold: 0.3,
      rootMargin: "0px 0px -10% 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-id");
          setVisibleSection(id);
        }
      });
    }, options);

    [introRef, systemRef, contactRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const sectionImages = {
    intro: "/images/intro.png",
    contact: "/images/contact.png",
    system: "/images/system.png",
  };

  return (
    <div className="h-full w-full overflow-x-hidden text-white p-4 flex flex-col">
      <div
        className="flex-1 overflow-y-auto scroll-smooth pr-2"
        style={{ direction: "rtl", scrollbarWidth: "thin", overflowX: "hidden" }}
      >
        <div className="flex flex-col space-y-12" style={{ direction: "ltr" }}>
          {/* 🔹 기본 소개 */}
          <section
            id="intro"
            ref={introRef}
            data-id="intro"
            className={`relative min-h-[80vh] p-6 py-10 rounded-xl bg-green-100/30 text-white transition-all duration-700 ease-out transform ${
              visibleSection === "intro"
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="flex flex-row items-center gap-10">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">기본 소개</h2>
                <p>스마트 에너지 관리 시스템 FEMSystem에 오신 걸 환영합니다.</p>
              </div>
              <div className="w-1/2">
                <img
                  src={sectionImages["intro"]}
                  alt="기본 소개 이미지"
                  className="rounded-xl shadow-md max-h-[60vh] w-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* 🔹 시스템 소개 (위치 변경) */}
          <section
            id="system"
            ref={systemRef}
            data-id="system"
            className={`relative min-h-[80vh] p-6 py-10 rounded-xl bg-green-100/30 text-white transition-all duration-700 ease-out transform ${
              visibleSection === "system"
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="flex flex-row items-center gap-10">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">시스템 소개</h2>
                <p>전력 모니터링, 분석, 알림 시스템이 통합된 솔루션을 제공합니다.</p>
              </div>
              <div className="w-1/2">
                <img
                  src={sectionImages["system"]}
                  alt="시스템 소개 이미지"
                  className="rounded-xl shadow-md max-h-[60vh] w-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* 🔹 문의하기 (위치 변경) */}
          <section
            id="contact"
            ref={contactRef}
            data-id="contact"
            className={`relative min-h-[80vh] p-6 py-10 rounded-xl bg-green-100/30 text-white transition-all duration-700 ease-out transform ${
              visibleSection === "contact"
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="flex flex-row items-center gap-10">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">문의하기</h2>
                <p>
                  문의: contact@fems.com
                  <br />
                  전화: 010-1234-5678
                </p>
              </div>
              <div className="w-1/2">
                <img
                  src={sectionImages["contact"]}
                  alt="문의 이미지"
                  className="rounded-xl shadow-md max-h-[60vh] w-full object-cover"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
