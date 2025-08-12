// 📁 src/contexts/alertContext.jsx
// 앱 전역 알림 컨텍스트: 피크 감지 + 추천 설비 + 1회 메일 전송 + 중복 방지

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { fetchPeakAlert, sendPeakAlertEmail } from "../apis/alertApi";

const AlertContext = createContext({
  isPeak: false,
  peakTime: null,
  recommendations: [],
  status: "idle", // idle | polling | error
  resetEmailLock: () => {},
  forcePoll: () => {},
});

/** recommendations 정규화 (facId 없는 항목 제거, facId 기준 중복 제거) */
function sanitizeRecommendations(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const out = [];
  for (const r of list) {
    const facId = r?.facId?.trim?.() || "";
    if (!facId || seen.has(facId)) continue;
    seen.add(facId);
    out.push({
      facId,
      name: r?.name ?? undefined,
      // expectedSaveKw, reason 등 전기표시/사유는 저장하지 않음
    });
  }
  return out;
}

/** 설비 ID만으로 Digest 생성(정렬 포함) */
function stableDigest(recs) {
  if (!Array.isArray(recs) || recs.length === 0) return "";
  const ids = recs
    .map((r) => r?.facId ?? "")
    .filter(Boolean)
    .sort();
  return JSON.stringify(ids);
}

/** 피크 이벤트 키(시간 + 설비 Digest) */
function buildPeakEventKey(data) {
  if (!data?.isPeak) return "";
  const t = data.time ?? "";
  const digest = stableDigest(data.recommendations);
  return `peak@${t}|${digest}`;
}

export function AlertProvider({
  children,
  pollMs = 5000,
  autoEmailOnPeak = true, // true면 새로운 피크 이벤트마다 1회 메일 전송
}) {
  const [isPeak, setIsPeak] = useState(false);
  const [peakTime, setPeakTime] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | polling | error

  const lastStateKeyRef = useRef("");
  const lastEmailKeyRef = useRef(localStorage.getItem("lastPeakEmailKey") || "");
  const aliveRef = useRef(true);
  const timerRef = useRef(null);
  const pollRequestedRef = useRef(false);

  const resetEmailLock = () => {
    lastEmailKeyRef.current = "";
    localStorage.removeItem("lastPeakEmailKey");
  };

  const forcePoll = () => {
    pollRequestedRef.current = true;
  };

  useEffect(() => {
    aliveRef.current = true;

    const loop = async () => {
      if (!aliveRef.current) return;
      setStatus("polling");

      try {
        const raw = await fetchPeakAlert();
        if (!aliveRef.current) return;

        // ✅ 전기표시/사유 제거 & 중복 제거된 안전한 리스트로 고정
        const safeRecs = sanitizeRecommendations(raw?.recommendations);
        const data = { isPeak: !!raw?.isPeak, time: raw?.time ?? null, recommendations: safeRecs };

        const newKey = buildPeakEventKey(data);
        const prevKey = lastStateKeyRef.current;

        // 상태 중복 업데이트 방지
        if (newKey !== prevKey) {
          setIsPeak(data.isPeak);
          setPeakTime(data.time);
          setRecommendations(safeRecs);
          lastStateKeyRef.current = newKey;
        }

        // 1회 메일 전송(새 이벤트 키에 대해서만)
        if (autoEmailOnPeak && data.isPeak && newKey && newKey !== lastEmailKeyRef.current) {
          try {
            await sendPeakAlertEmail({
              time: data.time,
              recommendations: safeRecs, // 설비만 전송
            });
            lastEmailKeyRef.current = newKey;
            localStorage.setItem("lastPeakEmailKey", newKey);
          } catch (e) {
            console.error("sendPeakAlertEmail failed:", e);
            // 재시도 원하면 lastEmailKeyRef를 갱신하지 않으면 됨.
          }
        }

        setStatus("idle");
      } catch (err) {
        if (!aliveRef.current) return;
        console.error("⚠️ 피크 상태 불러오기 실패", err);
        setStatus("error");
      } finally {
        if (!aliveRef.current) return;
        const delay = pollRequestedRef.current ? 0 : pollMs;
        pollRequestedRef.current = false;
        timerRef.current = setTimeout(loop, delay);
      }
    };

    loop();

    return () => {
      aliveRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pollMs, autoEmailOnPeak]);

  const ctx = {
    isPeak,
    peakTime,
    recommendations,
    status,
    resetEmailLock,
    forcePoll,
  };

  return <AlertContext.Provider value={ctx}>{children}</AlertContext.Provider>;
}

export function useAlert() {
  return useContext(AlertContext);
}
