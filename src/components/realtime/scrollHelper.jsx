import React, { useRef, useState, useEffect } from "react";

function ScrollHelperComponent() {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: null, y: null });
  const [drag, setDrag] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // 드래그 시작
  const onMouseDown = (e) => {
    setDrag(true);
    const rect = ref.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    document.body.style.userSelect = "none";
  };

  // 드래그 중
  const onMouseMove = (e) => {
    if (!drag) return;
    setPos({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  // 드래그 끝
  const onMouseUp = () => {
    setDrag(false);
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    if (drag) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      style={{
        position: "fixed",
        top: pos.y !== null ? pos.y : 112,
        left: pos.x !== null ? pos.x : undefined,
        right: pos.x === null ? 16 : undefined,
        zIndex: 50,
        cursor: drag ? "grabbing" : "grab",
      }}
      className="bg-white bg-opacity-90 shadow-xl rounded-lg px-3 py-4 flex flex-col items-center space-y-2 text-xs"
    >
      <div className="text-gray-600 font-semibold mb-1">이동 도우미</div>
      <button
        onClick={() => scrollToSection("detection")}
        className="bg-pink-500 hover:bg-pink-600 text-white px-2 py-1 rounded text-xs"
      >
        이상 감지
      </button>
      <button
        onClick={() => scrollToSection("graph")}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded text-xs"
      >
        그래프
      </button>
      <button
        onClick={() => scrollToSection("price")}
        className="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded text-xs"
      >
        요금 알림
      </button>
    </div>
  );
}

export default ScrollHelperComponent;
