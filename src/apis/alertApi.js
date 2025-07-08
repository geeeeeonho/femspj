// 알람의 상태를 서버에서 가져오기

import axios from "axios";

export const fetchPeakAlert = async () => {
  const res = await axios.get("/api/alerts/peak");
  return res.data; // 예: { isPeak: true, time: "2025-07-03 10:45" }
};
