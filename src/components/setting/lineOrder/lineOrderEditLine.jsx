// 📁 src/components/setting/lineOrder/LineOrderEditLine.jsx

import React, { useState } from 'react';
import { useLineOrder } from '../../../contexts/lineOrderContext';

export default function LineOrderEditLine({ lineIndex }) {
  const { lineOrder, deleteLine, updateProductId, saveLineOrder, fetchLineOrder } = useLineOrder();
  const { lineId, productId } = lineOrder[lineIndex] || {};
  const [saving, setSaving] = useState(false);

  const handleProductChange = e => {
    updateProductId(lineIndex, e.target.value);
  };

  const handleBlur = async () => {
    setSaving(true);
    try {
      const res = await saveLineOrder();
      if (!res?.success) {
        alert('제품 저장에 실패했습니다.');
        await fetchLineOrder();
      }
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
      await fetchLineOrder();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center space-x-2">
        <h3 className="font-medium">🏗 {lineId}</h3>
        <input
          type="text"
          value={productId}
          onChange={handleProductChange}
          onBlur={handleBlur}
          placeholder="제품 ID 입력"
          className="border rounded px-2 py-1 text-sm w-40"
          disabled={saving}
        />
      </div>
      <button
        onClick={() => deleteLine(lineIndex)}
        className="text-red-500 text-sm hover:underline"
        disabled={saving}
      >
        라인 삭제
      </button>
    </div>
  );
}
