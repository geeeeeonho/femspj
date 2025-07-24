// ✅ 1단계: 라인 전체 관리 컴포넌트 (LineOrderStep1)
// 📁 src/components/solution/lineOrder/lineOrderStep1.jsx

import { useLineOrder } from "../../../contexts/lineOrderContext";
import LineOrderStep2 from "./lineOrderStep2";

function LineOrderStep1() {
  const { lineOrder, setLineOrder } = useLineOrder();

  if (!lineOrder) return <div>로딩 중...</div>;

  const addLine = () => {
    const newLineId = `line${lineOrder.length + 1}`;
    setLineOrder((prev) => [...prev, { lineId: newLineId, equipment: [] }]);
  };

  const deleteLine = (index) => {
    setLineOrder((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {lineOrder.map((line, index) => (
        <LineOrderStep2
          key={line.lineId}
          lineData={line}
          lineIndex={index}
          setLineOrder={setLineOrder}
          allLineOrder={lineOrder}
          onDeleteLine={() => deleteLine(index)}
        />
      ))}
      <button
        onClick={addLine}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        + 라인 추가
      </button>
    </div>
  );
}

export default LineOrderStep1;