// 📁 src/apis/lineOrderApi.js
import { http, isSample } from "./http";

const useSample = isSample();

/* ---------------- 샘플 데이터 (그대로 두셔도 됨) ---------------- */
async function fetchRawSample() {
  return Promise.resolve([
    {
      productId: "제품A",
      equipment: [
        { facId: "설비A", m_index: 0 },
        { facId: "설비B", m_index: 1 },
      ],
    },
  ]);
}

/* ---------------- 실제 GET (불러오기) ---------------- */
// (원본) async function fetchRawReal() { const res = await http.get('/api/equipment/order'); return res.data; }
// 수정됨: 204 방어 + 배열 보장
async function fetchRawReal() {
  const res = await http.get("/api/equipment/order", {
    validateStatus: (s) => [200, 204].includes(s),
  });
  if (res.status === 204) return [];
  const data = res.data;
  return Array.isArray(data) ? data : (Array.isArray(data?.rows) ? data.rows : []);
}

/* ---------------- Context ←→ API 변환 ---------------- */
function toContextShape(raw) {
  const arr = Array.isArray(raw) ? raw : [];

  // DB 결과가 납작한 형태: [{product_id, fac_id, m_index}, ...]
  if (arr.length > 0 && "product_id" in arr[0]) {
    const byProduct = new Map();
    arr.forEach((r) => {
      const p = r.product_id;
      if (!byProduct.has(p)) byProduct.set(p, []);
      byProduct.get(p).push({ facId: r.fac_id, m_index: r.m_index });
    });
    return Array.from(byProduct.entries()).map(([productId, list], idx) => ({
      lineId: `line${idx + 1}`,
      productId,
      equipment: list
        .slice()
        .sort((a, b) => a.m_index - b.m_index)
        .map((e) => e.facId),
      info: {},
    }));
  }

  // 이미 라인 단위 형태: [{ lineId, productId, equipment:[{facId,m_index}|string] }]
  return arr.map((item, idx) => ({
    lineId: item.lineId || `line${idx + 1}`,
    productId: item.productId || "",
    equipment: Array.isArray(item.equipment)
      ? item.equipment
          .slice()
          .sort((a, b) => (a?.m_index ?? 0) - (b?.m_index ?? 0))
          .map((e) => (typeof e === "string" ? e : e.facId || ""))
          .filter(Boolean)
      : [],
    info: item.info || {},
  }));
}

function toApiRows(contextData) {
  const rows = [];
  (contextData || []).forEach((line) => {
    const product = (line?.productId || "").trim();
    if (!product) return;
    (line?.equipment || []).forEach((facId, idx) => {
      const fac = (facId || "").trim();
      if (!fac) return;
      rows.push({ product_id: product, fac_id: fac, m_index: idx });
    });
  });
  return rows;
}

/* ---------------- Import / Export API ---------------- */
async function lineOrderImportSample() {
  const raw = await fetchRawSample();
  return toContextShape(raw);
}

async function lineOrderImportReal() {
  const raw = await fetchRawReal();
  return toContextShape(raw);
}

async function lineOrderExportSample(contextData) {
  console.log("📦 [샘플 모드] 보낼 데이터", toApiRows(contextData));
  return { success: true };
}

// (원본) async function lineOrderExportReal(contextData) {
// (원본)   const rows = toApiRows(contextData);
// (원본)   if (rows.length === 0) return { success: false, message: '저장할 데이터가 없습니다.' };
// (원본)   const res = await http.post('/api/equipment/order', rows);
// (원본)   return res.data;
// (원본) }
// 수정됨: 백엔드 업서트 규약에 맞춰 { items: rows }로 전송 + 검증/응답 방어
// (원본)
// async function lineOrderExportReal(contextData) {
//   const rows = toApiRows(contextData);
//   if (rows.length === 0) return { success: false, message: "저장할 데이터가 없습니다." };
//   const res = await http.post("/api/equipment/order", { items: rows }, {
//     validateStatus: (s) => s >= 200 && s < 500,
//   });
//   if (res.status >= 400) {
//     const msg = res?.data?.message || res?.statusText || "설비 순서 저장에 실패했습니다.";
//     return { success: false, message: msg };
//   }
//   return typeof res.data === "object" ? res.data : { success: true };
// }

// ✅ 수정됨: 먼저 '배열 그대로'로 보내고 400이면 '{items: rows}'로 재시도
async function lineOrderExportReal(contextData) {
  const rows = toApiRows(contextData);

  if (rows.length === 0) {
    return { success: false, message: "저장할 데이터가 없습니다." };
  }

  // 1) 배열 그대로 시도
  let res = await http.post("/api/equipment/order", rows, {
    validateStatus: (s) => s >= 200 && s < 500,
  });

  if (res.status === 400) {
    // 2) 서버가 래핑된 키를 기대할 수 있으니 재시도
    res = await http.post("/api/equipment/order", { items: rows }, {
      validateStatus: (s) => s >= 200 && s < 500,
    });
  }

  if (res.status >= 400) {
    const msg =
      res?.data?.message ||
      res?.statusText ||
      "설비 순서 저장에 실패했습니다.";
    return { success: false, message: msg };
  }

  return typeof res.data === "object" ? res.data : { success: true };
}


/* ---------------- 최종 export ---------------- */
export const lineOrderImportApi = useSample
  ? lineOrderImportSample
  : lineOrderImportReal;

export const lineOrderExportApi = useSample
  ? lineOrderExportSample
  : lineOrderExportReal;
