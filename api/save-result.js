// api/save-result.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Vercel serverless function
 * POST /api/save-result
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = req.body; // index.html에서 보내는 JSON

    const participantId = body.participantId || "unknown_participant";
    const startedAt = body.startedAt || "unknown_start";
    const finishedAt = body.finishedAt || "unknown_finish";

    const subject = `[UserStudy] New response from ${participantId}`;
    const text = `
New user-study response

Participant ID: ${participantId}
Started At: ${startedAt}
Finished At: ${finishedAt}

Full JSON:
${JSON.stringify(body, null, 2)}
`;

    // 이메일 발송
    await resend.emails.send({
      from: "User Study <no-reply@your-domain.com>", // Resend에서 허용된 발신 주소
      to: process.env.TARGET_EMAIL,                  // 내 이메일
      subject,
      text,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error in save-result:", err);
    res.status(500).json({ error: "Failed to store/send result" });
  }
}
