// ✅ 3단계: 버튼 기반 설비 순서 조작 UI (LineOrderStep3)
// 📁 src/components/setting/lineOrder/lineOrderStep3.jsx

function LineOrderStep3({ equipment, onMove, onDelete }) {
  return (
    <ul className="space-y-2">
      {equipment.map((eq, idx) => (
        <li
          key={eq + idx}
          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
        >
          <span className="font-medium">{eq}</span>
          <div className="space-x-1">
            <button
              onClick={() => onMove(idx, idx - 1)}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded disabled:opacity-30"
              disabled={idx === 0}
            >
              ↑</button>
            <button
              onClick={() => onMove(idx, idx + 1)}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded disabled:opacity-30"
              disabled={idx === equipment.length - 1}
            >
              ↓</button>
            <button
              onClick={() => onDelete(idx)}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded"
            >
              🗑</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default LineOrderStep3;