import axios from "axios";

// 실시간 전력 요금 정보 가져오기
export const fetchLivePrice = async () => {
  const res = await axios.get("/api/live/price");
  return res.data; // 예: { price: 23500, unit: "KRW", updatedAt: "2025-07-09T11:30:00+09:00" }
};
