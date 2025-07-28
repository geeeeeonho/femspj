// 📁 src/contexts/powerTypeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { fetchPowerType, savePowerType } from "../apis/powerTypeApi";
import { useAuth } from "./authContext"; // 로그인 사용자 ID

const PowerTypeContext = createContext();

export const PowerTypeProvider = ({ children }) => {
  const { user } = useAuth(); // user.id 사용
  const [selected, setSelected] = useState({ group: "", type: "" });
  const [groupOptions] = useState(["갑 II", "을"]);
  const [typeOptions] = useState(["선택 I", "선택 II", "선택 III"]);
  const [loading, setLoading] = useState(true);

  // ✅ 전력 유형 불러오기
  useEffect(() => {
    console.log("🟡 [PowerTypeContext] user:", user);
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchPowerType(user.id)
      .then((data) => {
        console.log("✅ fetchPowerType 응답:", data);
        if (data?.group && data?.type) {
          setSelected(data);
        } else {
          console.warn("⚠️ 서버에서 유효하지 않은 전력 유형 응답:", data);
        }
      })
      .catch((err) => {
        console.error("❌ 전력 유형 불러오기 실패:", err);
      })
      .finally(() => {
        console.log("🟢 로딩 완료 → setLoading(false)");
        setLoading(false);
      });
  }, [user]);

  // ✅ 전력 유형 변경
  const updatePowerType = (key, value) => {
    setSelected((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ 전력 유형 저장
  const save = async () => {
    if (!user || !user.id) return alert("로그인이 필요합니다.");
    try {
      setLoading(true);
      await savePowerType(user.id, selected);
      alert("전력 유형이 저장되었습니다.");
    } catch (err) {
      console.error("❌ 저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
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

export const usePowerType = () => {
  const context = useContext(PowerTypeContext);
  if (!context) throw new Error("usePowerType must be used within a PowerTypeProvider");
  return context;
};
