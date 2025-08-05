// 📁 src/components/setting/lineOrder/lineOrderStep3.jsx

import { useLineOrder } from "../../../contexts/lineOrderContext";

function LineOrderStep3({ lineIndex, onMove, onDelete }) {
  const { lineOrder, setLineOrder, saveLineOrder } = useLineOrder();
  const equipment = lineOrder[lineIndex]?.equipment || [];

  const handleNameChange = (idx, newName) => {
    const trimmed = newName.trim();
    // 중복된 이름 방지
    if (equipment.some((name, i) => i !== idx && name === trimmed)) {
      alert("설비 이름이 중복되었습니다. 다른 이름을 입력해주세요.");
      return;
    }
    const updatedEquip = [...equipment];
    updatedEquip[idx] = trimmed;

    const newLines = [...lineOrder];
    newLines[lineIndex] = { ...newLines[lineIndex], equipment: updatedEquip };
    setLineOrder(newLines);
  };

  const handleSave = async () => {
    // 저장 전 중복 체크
    const names = equipment.map(name => name.trim());
    const hasDup = names.some((name, i) => names.indexOf(name) !== i);
    if (hasDup) {
      alert("중복된 설비 이름이 있습니다. 중복을 제거해주세요.");
      return;
    }

    try {
      const res = await saveLineOrder(lineOrder);
      if (res?.success) {
        alert("설비 이름과 순서가 저장되었습니다.");
      } else {
        throw new Error("저장 실패");
      }
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <ul className="space-y-2">
        {equipment.map((eq, idx) => (
          <li
            key={`${lineIndex}-${idx}`}
            className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
          >
            <input
              type="text"
              value={eq}
              onChange={(e) => handleNameChange(idx, e.target.value)}
              placeholder="설비 이름"
              className="flex-1 mr-2 px-2 py-1 border rounded"
            />
            <div className="space-x-1">
              <button
                onClick={() => onMove(idx, idx - 1)}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded disabled:opacity-30"
                disabled={idx === 0}
              >
                ↑
              </button>
              <button
                onClick={() => onMove(idx, idx + 1)}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded disabled:opacity-30"
                disabled={idx === equipment.length - 1}
              >
                ↓
              </button>
              <button
                onClick={() => {
                  onDelete(idx);
                  const newLines = [...lineOrder];
                  const updatedEquip = equipment.filter((_, i) => i !== idx);
                  newLines[lineIndex] = { ...newLines[lineIndex], equipment: updatedEquip };
                  setLineOrder(newLines);
                }}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded"
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSave}
        className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        저장
      </button>
    </div>
  );
}

export default LineOrderStep3;
