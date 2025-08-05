// 📁 src/contexts/lineOrderContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { lineOrderImportApi, lineOrderExportApi } from '../apis/lineOrderApi';

const LineOrderContext = createContext(null);

export function LineOrderProvider({ children }) {
  const [lineOrder, setLineOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  // 초기 및 재요청용 데이터 불러오기
  const fetchLineOrder = useCallback(async () => {
    setLoading(true);
    try {
      const data = await lineOrderImportApi();
      const normalized = data.map(line => ({
        lineId: line.lineId,
        equipment: line.equipment || [],
        info: line.info || {},
      }));
      setLineOrder(normalized);
    } catch (err) {
      console.error('🚨 설비 순서 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLineOrder();
  }, [fetchLineOrder]);

  // 저장
  const saveLineOrder = useCallback(async () => {
    const res = await lineOrderExportApi(lineOrder);
    return res;
  }, [lineOrder]);

  // 라인 추가/삭제
  const addLine = useCallback(() => {
    setLineOrder(prev => [
      ...prev,
      { lineId: `line${prev.length + 1}`, equipment: [], info: {} },
    ]);
  }, []);

  const deleteLine = useCallback(lineIndex => {
    setLineOrder(prev => prev.filter((_, idx) => idx !== lineIndex));
  }, []);

  // 설비 순서 이동
  const moveEquip = useCallback((lineIndex, fromIdx, toIdx) => {
    setLineOrder(prev => {
      const lines = [...prev];
      const equip = [...lines[lineIndex].equipment];
      if (toIdx < 0 || toIdx >= equip.length) return prev;
      const [moved] = equip.splice(fromIdx, 1);
      equip.splice(toIdx, 0, moved);
      lines[lineIndex] = { ...lines[lineIndex], equipment: equip };
      return lines;
    });
  }, []);

  // 설비 이름 변경
  const renameEquipment = useCallback((lineIndex, eqIndex, newName) => {
    setLineOrder(prev => {
      const lines = [...prev];
      const line = lines[lineIndex];
      const equip = [...line.equipment];
      const oldName = equip[eqIndex];
      equip[eqIndex] = newName;
      const info = { ...line.info };
      if (info[oldName] !== undefined) {
        info[newName] = info[oldName];
        delete info[oldName];
      }
      lines[lineIndex] = { ...line, equipment: equip, info };
      return lines;
    });
  }, []);

  // 설비 추가
  const addEquipment = useCallback(lineIndex => {
    setLineOrder(prev => {
      const lines = [...prev];
      const line = lines[lineIndex];
      const equip = [...line.equipment];
      const newEq = `설비${String.fromCharCode(65 + equip.length)}`;
      equip.push(newEq);
      const info = { ...line.info, [newEq]: '' };
      lines[lineIndex] = { ...line, equipment: equip, info };
      return lines;
    });
  }, []);

  // 설비 삭제
  const deleteEquipment = useCallback((lineIndex, eqIndex) => {
    setLineOrder(prev => {
      const lines = [...prev];
      const line = lines[lineIndex];
      const equip = [...line.equipment];
      const removed = equip.splice(eqIndex, 1)[0];
      const info = { ...line.info };
      delete info[removed];
      lines[lineIndex] = { ...line, equipment: equip, info };
      return lines;
    });
  }, []);

  // 설비 추가 정보 업데이트
  const updateEquipmentInfo = useCallback((lineIndex, eqName, newInfo) => {
    setLineOrder(prev => {
      const lines = [...prev];
      const line = lines[lineIndex];
      const info = { ...line.info, [eqName]: newInfo };
      lines[lineIndex] = { ...line, info };
      return lines;
    });
  }, []);

  return (
    <LineOrderContext.Provider
      value={{
        lineOrder,
        loading,
        fetchLineOrder,
        saveLineOrder,
        addLine,
        deleteLine,
        moveEquip,
        renameEquipment,
        addEquipment,
        deleteEquipment,
        updateEquipmentInfo,
      }}
    >
      {children}
    </LineOrderContext.Provider>
  );
}

export function useLineOrder() {
  const context = useContext(LineOrderContext);
  if (!context) throw new Error('useLineOrder must be used within LineOrderProvider');
  return context;
}
