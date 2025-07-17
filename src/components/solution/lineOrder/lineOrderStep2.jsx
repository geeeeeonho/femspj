// ✅ 2단계: 개별 라인 내 설비 순서 조정 컴포넌트 (LineOrderStep2)
// 📁 src/components/solution/lineOrder/lineOrderStep2.jsx

import LineOrderStep3 from "./lineOrderStep3";

function LineOrderStep2({ lineData, lineIndex, setLineOrder, allLineOrder }) {
  const { lineId, equipment } = lineData;

  if (!Array.isArray(equipment) || equipment.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">🏗 {lineId}</h3>
        <p className="text-red-500">⚠️ 설비 데이터가 존재하지 않습니다.</p>
      </div>
    );
  }

  const moveEquip = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= equipment.length) return;
    const newEquip = [...equipment];
    const [moved] = newEquip.splice(fromIdx, 1);
    newEquip.splice(toIdx, 0, moved);

    const newLines = [...allLineOrder];
    newLines[lineIndex] = { ...newLines[lineIndex], equipment: newEquip };
    setLineOrder(newLines);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">
        🏗 {lineId} (설비 순서 조정)
      </h3>
      <LineOrderStep3
        equipment={equipment}
        onMove={moveEquip}
      />
    </div>
  );
}

export default LineOrderStep2;