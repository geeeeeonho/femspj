// 📁 src/apis/lineOrderApi.js
import { http, isSample } from './http';

const useSample = isSample();

/* ---------------- 샘플 데이터 (그대로 두셔도 됨) ---------------- */
async function fetchRawSample() {
  return Promise.resolve([
    {
      productId: '제품A',
      equipment: [
        { facId: '설비A', m_index: 0 },
        { facId: '설비B', m_index: 1 },
      ],
    },
  ]);
}

/* ---------------- 실제 GET (불러오기) ---------------- */
async function fetchRawReal() {
  // 서버가 /api/equipment/order GET으로 현재 순서를 리턴한다고 가정
  const res = await http.get('/api/equipment/order');
  return res.data;
}

/* ---------------- Context ←→ API 변환 ---------------- */
function toContextShape(raw) {
  const arr = Array.isArray(raw) ? raw : [];
  // raw가 [{product_id, fac_id, m_index}, ...] 형태일 수도 있고,
  // [{productId, equipment:[{facId, m_index}, ...]}]일 수도 있어서 두 케이스 방어
  if (arr.length > 0 && 'product_id' in arr[0]) {
    const byProduct = new Map();
    arr.forEach((r) => {
      const p = r.product_id;
      if (!byProduct.has(p)) byProduct.set(p, []);
      byProduct.get(p).push({ facId: r.fac_id, m_index: r.m_index });
    });
    return Array.from(byProduct.entries()).map(([productId, list], idx) => ({
      lineId: `line${idx + 1}`,
      productId,
      equipment: list.sort((a, b) => a.m_index - b.m_index).map((e) => e.facId),
      info: {},
    }));
  }

  return arr.map((item, idx) => ({
    lineId: item.lineId || `line${idx + 1}`,
    productId: item.productId || '',
    equipment: Array.isArray(item.equipment)
      ? item.equipment.sort((a, b) => a.m_index - b.m_index).map((e) => e.facId || e)
      : [],
    info: item.info || {},
  }));
}

function toApiRows(contextData) {
  const rows = [];
  (contextData || []).forEach((line) => {
    const product = (line?.productId || '').trim();
    if (!product) return;
    (line?.equipment || []).forEach((facId, idx) => {
      const fac = (facId || '').trim();
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
  console.log('📦 [샘플 모드] 보낼 데이터', toApiRows(contextData));
  return { success: true };
}

async function lineOrderExportReal(contextData) {
  const rows = toApiRows(contextData);
  if (rows.length === 0) return { success: false, message: '저장할 데이터가 없습니다.' };
  const res = await http.post('/api/equipment/order', rows);
  return res.data;
}

/* ---------------- 최종 export ---------------- */
export const lineOrderImportApi = useSample
  ? lineOrderImportSample
  : lineOrderImportReal;

export const lineOrderExportApi = useSample
  ? lineOrderExportSample
  : lineOrderExportReal;
