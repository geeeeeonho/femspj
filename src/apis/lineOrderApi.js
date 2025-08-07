// 📁 src/apis/lineOrderApi.js
// 설명: 샘플 모드 여부에 따라 API의 “raw” 형태 ↔ Context 형태 간 매핑을 담당합니다.

// ✅ 환경 변수에서 API 주소 불러오기
const BASE_URL = 'https://api.sensor-tive.com';

// ✅ 샘플 모드 전역 설정 (false로 바꾸면 실서버와 연결됨)
const isSampleMode = true;

/* -----------------------------------------
 * ✅ Raw API 형태
 *   [
 *     {
 *       productId: "p1",
 *       equipment: [
 *         { facId: "123", m_index: 0 },
 *         { facId: "456", m_index: 1 },
 *         { facId: "789", m_index: 2 }
 *       ]
 *     },
 *     ...
 *   ]
 * ----------------------------------------- */
async function fetchRawSample() {
  return Promise.resolve([
    {
      productId: "제품A",
      equipment: [
        { facId: "설비A", m_index: 0 },
        { facId: "설비B", m_index: 1 },
        { facId: "설비C", m_index: 2 },
      ]
    },
    {
      productId: "제품B",
      equipment: [
        { facId: "설비D", m_index: 0 },
        { facId: "설비E", m_index: 1 },
      ]
    },
  ]);
}

async function fetchRawReal() {
  const res = await fetch(`${BASE_URL}/api/equipment/order`);
  if (!res.ok) throw new Error('서버 응답 오류');
  return res.json();
}

/* -----------------------------------------
 * ✅ Context가 사용하는 형태
 *   [
 *     {
 *       lineId: "line1",
 *       productId: "...",
 *       equipment: ["설비A", "설비B", ...],
 *       info: {}  // 기존 구조 유지
 *     },
 *     ...
 *   ]
 * ----------------------------------------- */
function toContextShape(rawData) {
  return rawData.map((item, idx) => ({
    // 기존 lineOrderContext의 lineId 규칙 유지
    lineId: item.lineId || `line${idx + 1}`,
    productId: item.productId || '',
    equipment: Array.isArray(item.equipment)
      ? item.equipment.sort((a, b) => a.m_index - b.m_index).map(e => e.facId)
      : [],
    info: {}, // API에 info가 있으면 추가로 매핑하세요
  }));
}

/* -----------------------------------------
 * ✅ Raw API로 보내는 형태
 * ----------------------------------------- */
function toApiShape(contextData) {
  return contextData.map(({ productId, equipment }) => ({
    productId,
    equipment: equipment.map((facId, idx) => ({ facId, m_index: idx })),
  }));
}

/* -----------------------------------------
 * ✅ Import (불러오기)
 * ----------------------------------------- */
export async function lineOrderImportSample() {
  const raw = await fetchRawSample();
  return toContextShape(raw);
}

export async function lineOrderImportReal() {
  try {
    const raw = await fetchRawReal();
    return toContextShape(raw);
  } catch (err) {
    console.error('🚨 실서버 설비 순서 불러오기 실패:', err);
    return [];
  }
}

/* -----------------------------------------
 * ✅ Export (저장)
 * ----------------------------------------- */
export async function lineOrderExportSample(contextData) {
  const apiBody = toApiShape(contextData);
  console.log('📦 [샘플 모드] API로 전송할 데이터 →', apiBody);
  return { success: true };
}

export async function lineOrderExportReal(contextData) {
  const apiBody = toApiShape(contextData);
  try {
    const res = await fetch(`${BASE_URL}/api/equipment/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiBody),
    });
    if (!res.ok) throw new Error('전송 실패');
    return await res.json();
  } catch (err) {
    console.error('🚨 실서버 설비 순서 전송 실패:', err);
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
