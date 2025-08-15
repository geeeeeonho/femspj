// 📁 src/components/setting/lineOrder/lineOrderEditor.jsx
import React, { useState } from 'react';
import { useLineOrder } from '../../../contexts/lineOrderContext';
import LineOrderEditLine from './lineOrderEditLine';
import LineOrderEditEquip from './lineOrderEditEquip';
import LineOrderEditInform from './lineOrderEditInform';

export default function LineOrderEditor() {
  const { lineOrder, addLine, saveLineOrder, fetchLineOrder } = useLineOrder();

  // 각 라인의 펼침 상태 관리
  const [openLines, setOpenLines] = useState(() => lineOrder.map(() => true));

  const toggleLine = (idx) => {
    setOpenLines((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const handleSave = async () => {
    // ★ 0) 라인 간 제품(productId) 중복 체크
    // - 공백/빈값은 제외하고 비교
    // - 중복 시 알림 후 저장 중단 (사용자가 바로 수정할 수 있도록 되돌리기는 하지 않음)
    const seen = new Map(); // productId -> lineIndex
    for (let i = 0; i < lineOrder.length; i++) {
      const pid = (lineOrder[i]?.productId ?? '').trim();
      if (!pid) continue;

      if (seen.has(pid)) {
        // 중복 발견: 두 라인을 펼쳐서 바로 수정 가능하게
        const otherIdx = seen.get(pid);
        setOpenLines((prev) => {
          const next = [...(prev.length === lineOrder.length ? prev : lineOrder.map(() => true))];
          next[i] = true;
          next[otherIdx] = true;
          return next;
        });
        alert('다른 라인에 중복 제품이 있습니다.');
        return;
      }
      seen.set(pid, i);
    }

    // 1) 각 라인 내부 설비 이름 중복 체크 (기존 로직 유지)
    for (let i = 0; i < lineOrder.length; i++) {
      const equipment = (lineOrder[i]?.equipment ?? []).map((name) => (name ?? '').trim());
      const duplicates = equipment.filter((name, idx) => name && equipment.indexOf(name) !== idx);
      if (duplicates.length > 0) {
        alert(
          `라인 ${lineOrder[i].lineId}에 중복된 설비 이름이 있습니다: ${[
            ...new Set(duplicates),
          ].join(', ')}`
        );
        // 기존 동작 유지: 서버 상태로 되돌리기
        await fetchLineOrder();
        return;
      }
    }

    try {
      const res = await saveLineOrder();
      if (res?.success) {
        alert('라인 순서와 정보가 저장되었습니다.');
      } else {
        alert('저장에 실패했습니다. 다시 시도해주세요.');
        await fetchLineOrder();
      }
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
      await fetchLineOrder();
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">라인 편집기</h2>

      {lineOrder.map((line, idx) => (
        <div key={line.lineId} className="mb-6 border-b pb-4">
          <button
            onClick={() => toggleLine(idx)}
            className="w-full text-left px-4 py-2 font-medium flex justify-between items-center hover:bg-gray-100"
          >
            <span>🏗 {line.lineId}</span>
            <span className="text-sm text-gray-500">
              {openLines[idx] ? '▲ 접기' : '▼ 펼치기'}
            </span>
          </button>

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
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          저장
        </button>
      </div>
    </div>
  );
}
