// 📁 src/components/setting/lineOrder/LineOrderEditLine.jsx

import React from 'react';
import { useLineOrder } from '../../../contexts/lineOrderContext';

export default function LineOrderEditLine({ lineIndex }) {
  const { lineOrder, deleteLine, updateProductId } = useLineOrder();
  const { lineId, productId } = lineOrder[lineIndex] || {};

  return (
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center space-x-2">
        <h3 className="font-medium">🏗 {lineId}</h3>
        <input
          type="text"
          value={productId}
          onChange={e => updateProductId(lineIndex, e.target.value)}
          placeholder="제품 ID 입력"
          className="border rounded px-2 py-1 text-sm"
        />
      </div>
      <button
        onClick={() => deleteLine(lineIndex)}
        className="text-red-500 text-sm hover:underline"
      >
        라인 삭제
      </button>
    </div>
  );
}
