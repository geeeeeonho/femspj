// 📁 src/apis/lineOrderApi.js

// ✅ 설비 순서 불러오기 (샘플 or 실제)
export async function lineOrderImportApi(useSample = true) {
  if (useSample) {
    // 샘플 데이터: 라인 2개, 설비 5개씩
    return Promise.resolve([
      {
        lineId: "line1",
        equipment: ["설비A", "설비B", "설비C", "설비D", "설비E"],
      },
      {
        lineId: "line2",
        equipment: ["설비F", "설비G", "설비H", "설비I", "설비J"],
      },
    ]);
  }

  // ✅ 실제 API 사용 시 코드 (주석 처리)
  /*
  try {
    const res = await fetch("/api/equipment/order");
    if (!res.ok) throw new Error("서버 응답 오류");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("🚨 설비 순서 불러오기 실패:", err);
    return [];
  }
  */
}

// ✅ 설비 순서 전송 (서버 저장용)
export async function lineOrderExportApi(updatedData) {
  try {
    const res = await fetch("/api/equipment/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("전송 실패");

    return await res.json();
  } catch (err) {
    console.error("🚨 설비 순서 전송 실패:", err);
    return { success: false };
  }
}
