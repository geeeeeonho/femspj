// 📁 src/contexts/lineOrderContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { lineOrderImportApi, lineOrderExportApi } from '../apis/lineOrderApi';
import { useAuth } from './authContext';

const LineOrderContext = createContext(null);

export function LineOrderProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [lineOrder, setLineOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLineOrder = useCallback(async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await lineOrderImportApi();
      const list = Array.isArray(data) ? data : [];
      const normalized = list.map((line, i) => ({
        lineId: line.lineId || `line${i + 1}`,
        productId: line.productId || '',
        equipment: Array.isArray(line.equipment) ? line.equipment : [],
        info: line.info || {},
      }));
      setLineOrder(normalized);
    } catch (err) {
      console.error('🚨 설비 순서 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => { fetchLineOrder(); }, [fetchLineOrder]);

  const saveLineOrder = useCallback(async () => {
    try {
      return await lineOrderExportApi(lineOrder);
    } catch (e) {
      console.error('🚨 설비 순서 저장 실패:', e);
      return { success: false };
    }
  }, [lineOrder]);

  // ===== 편집 함수들 다시 제공 =====
  const addLine = useCallback(() => {
    setLineOrder(prev => [
      ...prev,
      { lineId: `line${prev.length + 1}`, productId: '', equipment: [], info: {} },
    ]);
  }, []);

  const deleteLine = useCallback(lineIndex => {
    setLineOrder(prev => prev.filter((_, idx) => idx !== lineIndex));
  }, []);

  const updateProductId = useCallback((lineIndex, newProductId) => {
    setLineOrder(prev => {
      const lines = [...prev];
      lines[lineIndex] = { ...lines[lineIndex], productId: newProductId };
      return lines;
    });
  }, []);

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
        // 편집용 함수들
        addLine,
        deleteLine,
        updateProductId,
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
  const ctx = useContext(LineOrderContext);
  if (!ctx) throw new Error('useLineOrder must be used within LineOrderProvider');
  return ctx;
}
