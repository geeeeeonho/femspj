// ✅ 2단계: 개별 라인 내 설비 순서 조정 컴포넌트 (LineOrderStep2)
// 📁 src/components/setting/lineOrder/lineOrderStep2.jsx

import LineOrderStep3 from "./lineOrderStep3";

function LineOrderStep2({ lineData, lineIndex, setLineOrder, allLineOrder, onDeleteLine }) {
  const { lineId, equipment } = lineData;

  const moveEquip = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= equipment.length) return;
    const newEquip = [...equipment];
    const [moved] = newEquip.splice(fromIdx, 1);
    newEquip.splice(toIdx, 0, moved);

    const newLines = [...allLineOrder];
    newLines[lineIndex] = { ...newLines[lineIndex], equipment: newEquip };
    setLineOrder(newLines);
  };

  const addEquipment = () => {
    const newEq = `설비${String.fromCharCode(65 + equipment.length)}`;
    const newEquip = [...equipment, newEq];
    const newLines = [...allLineOrder];
    newLines[lineIndex] = { ...newLines[lineIndex], equipment: newEquip };
    setLineOrder(newLines);
  };

  const deleteEquipment = (idx) => {
    const newEquip = equipment.filter((_, i) => i !== idx);
    const newLines = [...allLineOrder];
    newLines[lineIndex] = { ...newLines[lineIndex], equipment: newEquip };
    setLineOrder(newLines);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">
          🏗 {lineId} (설비 순서 조정)
        </h3>
        <button
          onClick={onDeleteLine}
          className="text-red-500 text-sm hover:underline"
        >
          라인 삭제
        </button>
      </div>
      <LineOrderStep3
        equipment={equipment}
        onMove={moveEquip}
        onDelete={deleteEquipment}
      />
      <button
        onClick={addEquipment}
        className="mt-2 text-blue-600 text-sm hover:underline"
      >
        + 설비 추가
      </button>
    </div>
  );
}

export default LineOrderStep2;
