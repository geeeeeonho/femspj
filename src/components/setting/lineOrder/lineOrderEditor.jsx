// 📁 src/components/setting/lineOrder/LineOrderEditor.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLineOrder } from '../../../contexts/lineOrderContext';
import LineOrderEditLine from './lineOrderEditLine';
import LineOrderEditEquip from './lineOrderEditEquip';
import LineOrderEditInform from './lineOrderEditInform';

export default function LineOrderEditor() {
  const { lineOrder, addLine, saveLineOrder, fetchLineOrder } = useLineOrder();

  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  // openLines 를 lineOrder 길이에 맞게 동기화
  const [openLines, setOpenLines] = useState([]);
  useEffect(() => {
    setOpenLines(prev =>
      Array(lineOrder.length)
        .fill(true)
        .map((_, i) => (prev[i] ?? true))
    );
  }, [lineOrder.length]);

  const toggleLine = useCallback((idx) => {
    setOpenLines(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);

    // 중복 설비명 체크
    for (let i = 0; i < lineOrder.length; i++) {
      const equipment = (lineOrder[i]?.equipment || []).map((name) => String(name).trim());
      const duplicates = equipment.filter((name, idx) => equipment.indexOf(name) !== idx);
      if (duplicates.length > 0) {
        alert(`라인 ${lineOrder[i].lineId}에 중복된 설비 이름이 있습니다: ${[...new Set(duplicates)].join(", ")}`);
        await fetchLineOrder(); // 서버 상태로 되돌리기
        setBusy(false);
        busyRef.current = false;
        return;
      }
    }

    try {
      const res = await saveLineOrder();
      if (res?.success) {
        alert('라인 순서와 정보가 저장되었습니다.');
        await fetchLineOrder(); // ✅ 성공 시 1회만 재로드
      } else {
        alert('저장에 실패했습니다. 다시 시도해주세요.');
        // 실패 시 재로딩 생략(사용자 입력 유지)
      }
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
      // 실패 시 재로딩 생략
    } finally {
      setBusy(false);
      busyRef.current = false;
    }
  }, [lineOrder, saveLineOrder, fetchLineOrder]);

  return (
    <div className="bg-gray-50 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">라인 편집기</h2>

      {lineOrder.map((line, idx) => (
        <div key={line.lineId ?? `line-${idx}`} className="mb-6 border-b pb-4">
          <button
            onClick={() => toggleLine(idx)}
            className="w-full text-left px-4 py-2 font-medium flex justify-between items-center hover:bg-gray-100"
            disabled={busy}
          >
            <span>🏗 {line.lineId ?? `line${idx + 1}`}</span>
            <span className="text-sm text-gray-500">
              {openLines[idx] ? '▲ 접기' : '▼ 펼치기'}
            </span>
          </button>

          {openLines[idx] && (
            <div className="px-4 pt-2">
              <LineOrderEditLine lineIndex={idx} disabled={busy} />
              <LineOrderEditEquip lineIndex={idx} disabled={busy} />
              <LineOrderEditInform lineIndex={idx} disabled={busy} />
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-4">
        <button
          onClick={addLine}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          disabled={busy}
        >
          + 라인 추가
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-60"
          disabled={busy}
        >
          {busy ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
}
