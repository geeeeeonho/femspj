// 📄 src/components/power/scrollHelper.jsx

function ScrollHelperComponent() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed top-28 right-4 z-50 bg-white bg-opacity-90 shadow-xl rounded-lg px-3 py-4 flex flex-col items-center space-y-3 text-xs">
      <div className="text-gray-600 font-semibold mb-1">이동 도우미</div>
      <button onClick={() => scrollToSection("weekly")} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">주간</button>
      <button onClick={() => scrollToSection("monthly")} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">월간</button>
      <button onClick={() => scrollToSection("analyze")} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm">분석</button>
    </div>
  );
}

export default ScrollHelperComponent;
