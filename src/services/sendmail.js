// 📁 service/sendMail.js
// 피크 알림 메일 발송 서비스
// 환경변수: SMTP_HOST, SMTP_PORT, SMTP_SECURE(true/false), SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_DEFAULT_TO, APP_NAME

const nodemailer = require("nodemailer");

const {
  SMTP_HOST,
  SMTP_PORT = 587,
  SMTP_SECURE = "false", // "true"면 465
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM,
  MAIL_DEFAULT_TO,
  APP_NAME = "Easy FEMS",
} = process.env;

// --- Transporter 생성 ---
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: String(SMTP_SECURE).toLowerCase() === "true",
  auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

// --- 유틸: KST 문자열 만들기 ---
function formatKST(dateOrStr) {
  if (!dateOrStr) return "";
  try {
    if (typeof dateOrStr === "string") return dateOrStr;
    return new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .format(dateOrStr)
      .replace(/\./g, "")
      .replace(/\s/g, " ")
      .trim();
  } catch {
    return String(dateOrStr);
  }
}

// --- 유틸: recommendations 정리(전기표시/사유 제거, facId 중복 제거) ---
function sanitizeRecommendations(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const out = [];
  for (const r of list) {
    const facId = (r?.facId ?? "").trim();
    if (!facId || seen.has(facId)) continue;
    seen.add(facId);
    out.push({
      facId,
      name: r?.name ?? undefined,
      // expectedSaveKw, reason 등은 받지/저장/표시하지 않음
    });
  }
  return out;
}

// --- 본문 구성 (설비만 나열) ---
function buildPeakMail({ time, recommendations = [] }) {
  const timeStr = formatKST(time);
  const safeRecs = sanitizeRecommendations(recommendations);

  const subject = `[${APP_NAME}] 전력 피크 경보${timeStr ? " - " + timeStr : ""}`;

  const listText =
    safeRecs.length === 0
      ? "- (추천 설비 없음)"
      : safeRecs
          .map((r) => {
            const name = r.name || r.facId || "(설비)";
            return `- ${name}`;
          })
          .join("\n");

  const text = [
    "곧 전력 피크 상황이 예상됩니다.",
    "다음과 같은 설비를 점검하거나 일시중단 하세요:",
    "",
    listText,
  ].join("\n");

  const listHtml =
    safeRecs.length === 0
      ? "<li>(추천 설비 없음)</li>"
      : safeRecs
          .map((r) => {
            const name = r.name || r.facId || "(설비)";
            return `<li>${name}</li>`;
          })
          .join("");

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; line-height:1.6;">
      <h2 style="margin:0 0 8px;">전력 피크 경보</h2>
      ${timeStr ? `<div style="color:#666; margin-bottom:12px;">발생 시각(현지): ${timeStr}</div>` : ""}
      <p style="margin:0 0 8px;">곧 전력 피크 상황이 예상됩니다.</p>
      <p style="margin:0 0 8px;">다음과 같은 설비를 점검하거나 일시중단 하세요:</p>
      <ul style="margin:8px 0 0 18px; padding:0;">
        ${listHtml}
      </ul>
      <hr style="margin:16px 0; border:none; border-top:1px solid #eee;" />
      <div style="font-size:12px; color:#888;">본 메일은 ${APP_NAME}에서 자동 발송되었습니다.</div>
    </div>
  `;

  return { subject, text, html };
}

// --- 수신자 결정: req.user.email → body.to → MAIL_DEFAULT_TO ---
function resolveRecipients({ to, user }) {
  if (to) return Array.isArray(to) ? to.join(",") : String(to);
  if (user?.email) return String(user.email);
  if (MAIL_DEFAULT_TO) return String(MAIL_DEFAULT_TO);
  throw new Error("수신자 이메일을 찾을 수 없습니다(to/user.email/MAIL_DEFAULT_TO).");
}

/**
 * 피크 알림 메일 전송
 * @param {Object} params
 * @param {string|Date|null} params.time - "HH:mm:ss" 또는 Date
 * @param {Array} params.recommendations - [{facId, name?}]  // 전기표시/사유 없음
 * @param {string|string[]=} params.to - (선택) 강제 수신자
 * @param {Object=} params.user - (선택) auth 미들웨어로 채워진 사용자 객체(예: { email })
 */
async function sendPeakAlertEmail({ time = null, recommendations = [], to = null, user = null }) {
  const recipients = resolveRecipients({ to, user });
  const { subject, text, html } = buildPeakMail({ time, recommendations });

  const from = MAIL_FROM || SMTP_USER;
  if (!from) throw new Error("발신자(MAIL_FROM 또는 SMTP_USER)가 설정되어 있지 않습니다.");

  const info = await transporter.sendMail({
    from,
    to: recipients,
    subject,
    text,
    html,
    headers: { "X-Mailer": `${APP_NAME}-alert` },
  });

  return { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected };
}

module.exports = {
  sendPeakAlertEmail,
  buildPeakMail,
};
