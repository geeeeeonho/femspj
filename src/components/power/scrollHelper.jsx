import React, { useRef, useState, useEffect } from "react";

function ScrollHelperComponent() {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: null, y: null });
  const [drag, setDrag] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    setDrag(true);
    const rect = ref.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    document.body.style.userSelect = "none";
  };

  const onMouseMove = (e) => {
    if (!drag) return;
    setPos({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

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
  }, [drag, offset]);

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
        top: pos.y !== null ? pos.y : 112, // top-28
        left: pos.x !== null ? pos.x : undefined,
        right: pos.x === null ? 16 : undefined,
        zIndex: 50,
        cursor: drag ? "grabbing" : "grab",
      }}
      className="bg-white bg-opacity-90 shadow-xl rounded-lg px-3 py-4 flex flex-col items-center space-y-3 text-xs"
    >
      <div className="text-gray-600 font-semibold mb-1">이동 도우미</div>

      <button
        onClick={() => scrollToSection("weekly")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
      >
        주간
      </button>

      <button
        onClick={() => scrollToSection("monthly")}
        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
      >
        월간
      </button>

      <button
        onClick={() => scrollToSection("custom")}
        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
      >
        선택
      </button>
    </div>
  );
}

export default ScrollHelperComponent;
