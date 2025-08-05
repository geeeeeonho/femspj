// 📁 src/components/setting/lineOrder/lineOrderStep1.jsx

import { useLineOrder } from "../../../contexts/lineOrderContext";
import LineOrderStep2 from "./lineOrderStep2";

function LineOrderStep1() {
  const { lineOrder, setLineOrder, saveLineOrder, loading } = useLineOrder();

  if (loading) return <div>로딩 중...</div>;

  const addLine = () => {
    const newLineId = `line${lineOrder.length + 1}`;
    setLineOrder(prev => [
      ...prev,
      { lineId: newLineId, equipment: [] },
    ]);
  };

  const deleteLine = (index) => {
    setLineOrder(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const res = await saveLineOrder(lineOrder);
    if (res.success) {
      alert("라인 순서가 저장되었습니다.");
    } else {
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {lineOrder.map((_, index) => (
        <LineOrderStep2
          key={lineOrder[index].lineId}
          lineIndex={index}
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
