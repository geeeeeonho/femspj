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
    // [추가] user 없을 때 localStorage에서 폴백
    let uid = user?.id;
    if (!uid) {
      try {
        const raw = localStorage.getItem("user");
        if (raw) uid = JSON.parse(raw)?.id;
      } catch {}
    }

    if (!uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchPowerType(uid)
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
  // [수정] 성공/실패를 정확히 전파: 성공 true, 실패 throw
  const save = async () => {
    // 1) 선택값 검증
    if (!selected.group || !selected.type) {
      throw new Error("구분과 유형을 모두 선택하세요.");
    }

    // 2) 로그인/토큰 폴백 (Context가 비어도 요청이 나가도록)
    let uid = user?.id;
    if (!uid) {
      try {
        const raw = localStorage.getItem("user");
        if (raw) uid = JSON.parse(raw)?.id;
      } catch {}
    }
    const token = localStorage.getItem("token");

    if (!uid || !token) {
      // return alert("로그인이 필요합니다."); // [삭제: alert 선출력 금지]
      throw new Error("로그인이 필요합니다."); // [수정]
    }

    // 3) 실제 저장 호출
    setLoading(true);
    try {
      const res = await savePowerType(uid, selected); // { success: true } 기대
      if (!res || res.success !== true) {
        throw new Error("저장 실패(응답 비정상)");
      }
      return true; // 성공
    } catch (err) {
      throw err; // 상위에서 alert 처리
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
