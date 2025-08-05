// 📁 src/components/setting/lineOrder/LineOrderEditor.jsx

import React, { useState } from 'react';
import { useLineOrder } from '../../../contexts/lineOrderContext';
import LineOrderEditLine from './LineOrderEditLine';
import LineOrderEditEquip from './LineOrderEditEquip';
import LineOrderEditInform from './LineOrderEditInform';

export default function LineOrderEditor() {
  const { lineOrder, addLine, saveLineOrder } = useLineOrder();
  // 각 라인의 펼침 상태 관리
  const [openLines, setOpenLines] = useState(
    () => lineOrder.map(() => true)
  );

  const toggleLine = (idx) => {
    setOpenLines((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">라인 편집기</h2>

      {lineOrder.map((line, idx) => (
        <div key={line.lineId} className="mb-6 border-b pb-4">
          {/* 토글 버튼 */}
          <button
            onClick={() => toggleLine(idx)}
            className="w-full text-left px-4 py-2 font-medium flex justify-between items-center hover:bg-gray-100"
          >
            <span>🏗 {line.lineId}</span>
            <span className="text-sm text-gray-500">
              {openLines[idx] ? '▲ 접기' : '▼ 펼치기'}
            </span>
          </button>

          {/* 펼쳐진 경우에만 에디터 컴포넌트 렌더링 */}
          {openLines[idx] && (
            <div className="px-4 pt-2">
              <LineOrderEditLine lineIndex={idx} />
              <LineOrderEditEquip lineIndex={idx} />
              <LineOrderEditInform lineIndex={idx} />
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-4">
        <button
          onClick={addLine}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + 라인 추가
        </button>
        <button
          onClick={saveLineOrder}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          저장
        </button>
      </div>
    </div>
  );
}
