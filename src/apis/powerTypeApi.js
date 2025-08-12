// 📁 src/apis/powerTypeApi.js
import { http, isSample } from "./http";

// http.js에서 중앙 제어되는 샘플 플래그
const useSample = isSample();

// ✅ 샘플 데이터
const samplePowerType = {
  group: "을",
  type: "선택 II",
};

// ✅ 전력 유형 불러오기
export async function fetchPowerType(userId) {
  if (useSample) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(samplePowerType), 300);
    });
  } else {
    const res = await http.get(`/api/powertype/${userId}`);
    return res.data;
  }
}

// ✅ 전력 유형 저장하기
export async function savePowerType(userId, powerType) {
  if (useSample) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("🧪 mock 저장됨:", powerType);
        resolve({ success: true });
      }, 300);
    });
  } else {
    const res = await http.post(`/api/powertype/${userId}`, { powerType });
    return res.data;
  }
}
