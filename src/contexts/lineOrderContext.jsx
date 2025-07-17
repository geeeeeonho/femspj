// 📁 src/contexts/lineOrderContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { lineOrderImportApi, lineOrderExportApi } from "../apis/lineOrderApi";

// 컨텍스트 생성
const LineOrderContext = createContext();

// 프로바이더 컴포넌트
export function LineOrderProvider({ children }) {
  const [lineOrder, setLineOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  // 최초 데이터 불러오기 (샘플 데이터로 대체 가능)
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await lineOrderImportApi(true); // 실제 사용 시 false
      setLineOrder(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // 저장 함수 (API 전송)
  const saveLineOrder = async (updatedData) => {
    const res = await lineOrderExportApi(updatedData);
    if (res?.success) {
      setLineOrder(updatedData);
    }
    return res;
  };

  return (
    <LineOrderContext.Provider value={{ lineOrder, setLineOrder, saveLineOrder, loading }}>
      {children}
    </LineOrderContext.Provider>
  );
}

// 커스텀 훅
export function useLineOrder() {
  return useContext(LineOrderContext);
}
