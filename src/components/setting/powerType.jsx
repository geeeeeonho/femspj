// 📁 src/components/setting/powerTypeComponent.jsx
import { useEffect } from "react";
import { usePowerType } from "../../contexts/powerTypeContext";

function PowerTypeComponent() {
  const {
    selected,
    groupOptions,
    typeOptions,
    updatePowerType,
    save,
    loading,
  } = usePowerType();

  // "갑 II"일 경우 "선택 III" 자동 초기화
  useEffect(() => {
    if (selected.group === "갑 II" && selected.type === "선택 III") {
      updatePowerType("type", "");
    }
  }, [selected.group]);

  if (loading) {
    return (
      <div className="px-4 py-2 text-sm text-gray-500">
        ⚙️ 전력 유형 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-base font-semibold mb-4">🔌 전력 유형 설정</h3>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* 요금제 구분 선택 */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 text-gray-700">요금제 구분</label>
          <select
            value={selected.group || ""}
            onChange={(e) => updatePowerType("group", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="" disabled>구분 선택</option>
            {groupOptions.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        {/* 선택 유형 */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 text-gray-700">선택 유형</label>
          <select
            value={selected.type || ""}
            onChange={(e) => updatePowerType("type", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="" disabled>유형 선택</option>
            {typeOptions
              .filter((type) => {
                if (selected.group === "갑 II") {
                  return type !== "선택 III";
                }
                return true;
              })
              .map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="mt-6">
        <button
          onClick={save}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}

export default PowerTypeComponent;
