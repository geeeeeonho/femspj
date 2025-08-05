// 📁 src/components/setting/lineOrder/LineOrderEditEquip.jsx

import React from 'react';
import { useLineOrder } from '../../../contexts/lineOrderContext';

export default function LineOrderEditEquip({ lineIndex }) {
  const {
    lineOrder,
    renameEquipment,
    moveEquip,
    deleteEquipment,
    addEquipment
  } = useLineOrder();

  const equipment = lineOrder[lineIndex]?.equipment || [];

  return (
    <div className="mb-4">
      <h4 className="font-medium mb-2">설비 순서 및 이름 편집</h4>
      <ul className="space-y-2">
        {equipment.map((eq, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between bg-white px-3 py-2 rounded border"
          >
            <input
              type="text"
              value={eq}
              onChange={(e) => renameEquipment(lineIndex, idx, e.target.value)}
              placeholder="설비 이름"
              className="flex-1 mr-2 px-2 py-1 border rounded"
            />
            <div className="space-x-1">
              <button
                onClick={() => moveEquip(lineIndex, idx, idx - 1)}
                disabled={idx === 0}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded disabled:opacity-30"
              >
                ↑
              </button>
              <button
                onClick={() => moveEquip(lineIndex, idx, idx + 1)}
                disabled={idx === equipment.length - 1}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded disabled:opacity-30"
              >
                ↓
              </button>
              <button
                onClick={() => deleteEquipment(lineIndex, idx)}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded"
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => addEquipment(lineIndex)}
        className="mt-2 text-blue-600 text-sm hover:underline"
      >
        + 설비 추가
      </button>
    </div>
  );
}