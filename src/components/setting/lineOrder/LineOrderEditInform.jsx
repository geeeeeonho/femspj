// 📁 src/components/setting/lineOrder/LineOrderEditInform.jsx

import React from 'react';
import { useLineOrder } from '../../../contexts/lineOrderContext';

export default function LineOrderEditInform({ lineIndex }) {
  const { lineOrder, updateEquipmentInfo } = useLineOrder();
  const equipment = lineOrder[lineIndex]?.equipment || [];
  const info = lineOrder[lineIndex]?.info || {};

  return (
    <div className="mb-4">
      <h4 className="font-medium mb-2">설비 추가 정보 입력</h4>
      <ul className="space-y-2">
        {equipment.map((eq, idx) => (
          <li key={idx} className="flex items-center space-x-2">
            <span className="w-24">{eq}</span>
            <input
              type="text"
              value={info[eq] || ''}
              onChange={(e) => updateEquipmentInfo(lineIndex, eq, e.target.value)}
              placeholder="정보 입력"
              className="flex-1 px-2 py-1 border rounded"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
