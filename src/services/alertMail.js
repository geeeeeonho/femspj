// 📁 src/services/alertMail.js
import axios from "axios";
import { useAuth } from "../contexts/authContext";

// 서버 기본 URL (프로젝트 상수랑 맞춰주세요)
const BASE_URL = "https://api.sensor-tive.com";

// ✅ 전역 쿨다운/중복 방지
let lastEmailSentAt = 0;
let lastAlertSignature = "";
const DEFAULT_COOLDOWN_MS = 5 * 60 * 1000;

// 알람 시그니처(같은 알람 재전송 방지)
function makeSignature(alert) {
  const time = alert?.time ?? "";
  const facs = (alert?.recommendations || []).map((r) => r.facId).join("|");
  return `${time}::${facs}`;
}

// 메일 본문 포맷
function formatMessage(alert) {
  const lines = [];
  lines.push("전력 피크 발생 가능성이 감지되었습니다.");
  lines.push(`예측 시간: ${alert?.time ?? "-"}`);
  lines.push("");
  lines.push("아래 설비의 정지/점검을 권고합니다:");
  (alert?.recommendations || []).forEach((r, i) => {
    lines.push(`- ${i + 1}. ${r.facId}${r.lineId ? ` (${r.lineId})` : ""}`);
  });
  return lines.join("\n");
}

export function useAlertMailService() {
  const { user, token } = useAuth(); // 컨텍스트에서 이메일/토큰 직접 사용

  // 🔔 필요 시 즉시 메일 전송 시도
  async function sendAlertIfNeeded(alert, cooldownMs = DEFAULT_COOLDOWN_MS) {
    if (!alert?.isPeak) return;
    if (!Array.isArray(alert.recommendations) || alert.recommendations.length === 0) return;
    if (!user?.email) return; // 수신자 없음

    const now = Date.now();
    const sig = makeSignature(alert);
    if (sig === lastAlertSignature && now - lastEmailSentAt < cooldownMs) return;

    try {
      // 서버로 직접 전송 (emailApi.js 불필요)
      await axios.post(
        `${BASE_URL}/api/notifications/email`,
        {
          to: user.email,
          subject: "[Easy FEMS] 전력 피크 경보 및 조치 권고",
          message: formatMessage(alert),
          meta: { facilities: alert.recommendations, occurredAt: alert.time },
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      lastAlertSignature = sig;
      lastEmailSentAt = now;
    } catch (e) {
      console.error("🚨 경보 메일 전송 실패:", e);
    }
  }

  return { sendAlertIfNeeded };
}
