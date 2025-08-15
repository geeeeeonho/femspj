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
// (원본) export async function fetchPowerType(userId) {
// (원본)   if (useSample) { ... } else {
// (원본)     const res = await http.get(`/api/powertype/${userId}`);
// (원본)     return res.data;
// (원본)   }
// (원본) }
// 수정됨: 204(No Content) 대응 + 다양한 응답 형태 방어
export async function fetchPowerType(userId) {
  if (useSample) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(samplePowerType), 300);
    });
  } else {
    const res = await http.get(`/api/powertype/${userId}`, {
      validateStatus: (s) => [200, 204].includes(s),
    });
    if (res.status === 204) return null;

    // 서버가 {group,type} 또는 {data:{group,type}} 등으로 줄 수 있어 방어
    const d = res.data;
    if (!d) return null;
    if (d.group || d.type) return d;
    if (d.data && (d.data.group || d.data.type)) return d.data;
    return null;
  }
}

// ✅ 전력 유형 저장하기
// (원본) export async function savePowerType(userId, powerType) {
// (원본)   if (useSample) { ... } else {
// (원본)     const res = await http.post(`/api/powertype/${userId}`, { powerType });
// (원본)     return res.data;
// (원본)   }
// (원본) }
// 수정됨: 실패 메시지 표준화 + 2xx/4xx 모두 처리
export async function savePowerType(userId, powerType) {
  if (useSample) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("🧪 mock 저장됨:", powerType);
        resolve({ success: true });
      }, 300);
    });
  } else {
    const res = await http.post(
      `/api/powertype/${userId}`,
      { powerType },
      { validateStatus: (s) => s >= 200 && s < 500 }
    );

    if (res.status >= 400) {
      const msg =
        res?.data?.message || res?.statusText || "전력 유형 저장에 실패했습니다.";
      return { success: false, message: msg };
    }
    return typeof res.data === "object" ? res.data : { success: true };
  }
}
