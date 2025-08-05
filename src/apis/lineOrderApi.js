// 📁 src/apis/lineOrderApi.js
// 설명: 샘플 모드 여부에 따라 불러오기/저장 API를 자동 분기합니다.

// ✅ 환경 변수에서 API 주소 불러오기
const BASE_URL = 'https://api.sensor-tive.com';

// ✅ 샘플 모드 전역 설정 (false로 바꾸면 실서버와 연결됨)
const isSampleMode = true;

/* -----------------------------------------
 * ✅ 샘플 데이터 함수들 (isSampleMode = true)
 * ----------------------------------------- */
async function lineOrderImportSample() {
  // 샘플 데이터: lineId, equipment, info 객체 포함
  return Promise.resolve([
    {
      lineId: "line1",
      equipment: ["설비A", "설비B", "설비C", "설비D", "설비E"],
      info: {
        "설비A": "샘플 정보 A",
        "설비B": "샘플 정보 B",
        "설비C": "샘플 정보 C",
        "설비D": "샘플 정보 D",
        "설비E": "샘플 정보 E",
      },
    },
    {
      lineId: "line2",
      equipment: ["설비F", "설비G", "설비H", "설비I", "설비J"],
      info: {
        "설비F": "샘플 정보 F",
        "설비G": "샘플 정보 G",
      },
    },
  ]);
}

async function lineOrderExportSample(updatedData) {
  console.log("📦 샘플 모드: 저장된 설비 순서 및 정보 →", updatedData);
  return { success: true };
}

/* -----------------------------------------
 * ✅ 실제 API 함수들 (isSampleMode = false)
 * ----------------------------------------- */
async function lineOrderImportReal() {
  try {
    const res = await fetch(`${BASE_URL}/api/equipment/order`);
    if (!res.ok) throw new Error("서버 응답 오류");
    return await res.json(); // 서버 JSON에 lineId, equipment, info 포함
  } catch (err) {
    console.error("🚨 실서버 설비 순서 불러오기 실패:", err);
    return [];
  }
}

async function lineOrderExportReal(updatedData) {
  try {
    const res = await fetch(`${BASE_URL}/api/equipment/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    if (!res.ok) throw new Error("전송 실패");
    return await res.json();
  } catch (err) {
    console.error("🚨 실서버 설비 순서 전송 실패:", err);
    return { success: false };
  }
}

/* -----------------------------------------
 * ✅ Export: 샘플 모드 여부에 따라 자동 선택
 * ----------------------------------------- */
export const lineOrderImportApi = isSampleMode
  ? lineOrderImportSample
  : lineOrderImportReal;
export const lineOrderExportApi = isSampleMode
  ? lineOrderExportSample
  : lineOrderExportReal;
