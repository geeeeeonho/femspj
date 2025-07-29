// 📁 src/components/solution/lineOrder/lineOrderStep1.jsx

import { useLineOrder } from "../../../contexts/lineOrderContext";
import LineOrderStep2 from "./lineOrderStep2";

function LineOrderStep1() {
  const { lineOrder, setLineOrder, saveLineOrder } = useLineOrder();

  if (!lineOrder) return <div>로딩 중...</div>;

  const addLine = () => {
    const newLineId = `line${lineOrder.length + 1}`;
    setLineOrder((prev) => [...prev, { lineId: newLineId, equipment: [] }]);
  };

  const deleteLine = (index) => {
    setLineOrder((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (saveLineOrder) {
      saveLineOrder(lineOrder); // 컨텍스트 함수로 저장
      alert("라인 순서가 저장되었습니다.");
    } else {
      console.warn("saveLineOrder 함수가 존재하지 않습니다.");
    }
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

      <div className="flex gap-4 mt-6">
        <button
          onClick={addLine}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          + 라인 추가
        </button>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          💾 저장
        </button>
      </div>
    </div>
  );
}

export default LineOrderStep1;
