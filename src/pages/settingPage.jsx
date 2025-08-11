// 📁 src/pages/settingPage.jsx

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import LineOrderLayout from "../layouts/setting/lineOrderLayout";
import PowerTypeLayout from "../layouts/setting/powerTypeLayout";

function SettingPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth" });

      // ✅ 뒤로가기 시 다시 스크롤되는 걸 방지
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 px-0">
      {/* ✅ 전력 유형 설정 */}
      <section id="power-type" className="pt-10">
        <h2 className="text-lg font-bold mb-4 px-4 flex items-center gap-2">
          🔧 전력 유형 설정
        </h2>
        <PowerTypeLayout />
      </section>

      {/* ✅ 설비 순서 조정 */}
      <section id="summary" className="pt-20">
        <h2 className="text-lg font-bold mb-4 px-4 flex items-center gap-2">
          🔎 설비 순서 조정
        </h2>
        <LineOrderLayout />
      </section>
    </div>
  );
}

export default SettingPage;
