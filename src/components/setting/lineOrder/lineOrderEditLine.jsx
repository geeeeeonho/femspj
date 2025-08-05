// 📁 src/components/setting/lineOrder/LineOrderEditLine.jsx

import React from 'react';
import { useLineOrder } from '../../../contexts/lineOrderContext';

export default function LineOrderEditLine({ lineIndex }) {
  const { lineOrder, deleteLine } = useLineOrder();
  const { lineId } = lineOrder[lineIndex] || {};

  return (
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-medium">🏗 {lineId}</h3>
      <button
        onClick={() => deleteLine(lineIndex)}
        className="text-red-500 text-sm hover:underline"
      >
        라인 삭제
      </button>
    </div>
  );
}
