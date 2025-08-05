// 📁 src/components/setting/lineOrder/lineOrderStep2.jsx

import { useLineOrder } from "../../../contexts/lineOrderContext";
import LineOrderStep3 from "./lineOrderStep3";

function LineOrderStep2({ lineIndex, onDeleteLine }) {
  const { lineOrder, setLineOrder } = useLineOrder();
  const { lineId, equipment } = lineOrder[lineIndex] || { lineId: "", equipment: [] };

  const moveEquip = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= equipment.length) return;
    const newEquip = [...equipment];
    const [moved] = newEquip.splice(fromIdx, 1);
    newEquip.splice(toIdx, 0, moved);

    setLineOrder(prev => {
      const newLines = [...prev];
      newLines[lineIndex] = { ...newLines[lineIndex], equipment: newEquip };
      return newLines;
    });
  };

  const addEquipment = () => {
    const newEq = `설비${String.fromCharCode(65 + equipment.length)}`;
    setLineOrder(prev => {
      const newLines = [...prev];
      newLines[lineIndex] = { ...newLines[lineIndex], equipment: [...equipment, newEq] };
      return newLines;
    });
  };

  const deleteEquipment = (idx) => {
    setLineOrder(prev => {
      const newLines = [...prev];
      const updatedEquip = newLines[lineIndex].equipment.filter((_, i) => i !== idx);
      newLines[lineIndex] = { ...newLines[lineIndex], equipment: updatedEquip };
      return newLines;
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">🏗 {lineId} (설비 순서 조정)</h3>
        <button
          onClick={onDeleteLine}
          className="text-red-500 text-sm hover:underline"
        >
          라인 삭제
        </button>
      </div>

      <LineOrderStep3
        lineIndex={lineIndex}
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
