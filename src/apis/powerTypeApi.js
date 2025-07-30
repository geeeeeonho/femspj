// 📁 src/apis/powerTypeApi.js

import axios from "axios";

// ✅ 환경 변수에서 API 주소 불러오기
const BASE_URL = 'https://api.sensor-tive.com';

// ✅ 샘플 전환 변수
const isSampleMode = true; // true면 mock 사용, false면 실제 서버 사용

// ✅ 샘플 데이터
const samplePowerType = {
  group: "을",
  type: "선택 II",
};

// ✅ 전력 유형 불러오기
export async function fetchPowerType(userId) {
  if (isSampleMode) {
    // 💡 mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(samplePowerType);
      }, 300);
    });
  } else {
    // 💡 실제 API 호출
    const res = await axios.get(`${BASE_URL}/powertype/${userId}`);
    return res.data;
  }
}

// ✅ 전력 유형 저장하기
export async function savePowerType(userId, powerType) {
  if (isSampleMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("🧪 mock 저장됨:", powerType);
        resolve({ success: true });
      }, 300);
    });
  } else {
    const res = await axios.post(`${BASE_URL}/powertype/${userId}`, powerType);
    return res.data;
  }
}
