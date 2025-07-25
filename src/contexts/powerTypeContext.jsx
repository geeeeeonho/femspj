// 📁 src/contexts/powerTypeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

// 더미 데이터 (실제로는 서버에서 불러올 수 있음)
const dummyGroupOptions = ["갑 II", "을"];
const dummyTypeOptions = ["선택 I", "선택 II", "선택 III"];

const PowerTypeContext = createContext();

export const PowerTypeProvider = ({ children }) => {
  const [selected, setSelected] = useState({ group: "", type: "" });
  const [groupOptions, setGroupOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 초기 옵션 불러오기 (더미 데이터 사용)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setGroupOptions(dummyGroupOptions);
      setTypeOptions(dummyTypeOptions);
      setLoading(false);
    }, 500); // 비동기 흉내내기
  }, []);

  const updatePowerType = (key, value) => {
    setSelected((prev) => ({ ...prev, [key]: value }));
  };

  const save = () => {
    console.log("✅ 저장된 전력 유형:", selected);
    alert("전력 유형이 저장되었습니다!");
    // 여기서 서버에 저장 API 호출 가능
  };

  return (
    <PowerTypeContext.Provider
      value={{
        selected,
        groupOptions,
        typeOptions,
        updatePowerType,
        save,
        loading,
      }}
    >
      {children}
    </PowerTypeContext.Provider>
  );
};

export const usePowerType = () => useContext(PowerTypeContext);
