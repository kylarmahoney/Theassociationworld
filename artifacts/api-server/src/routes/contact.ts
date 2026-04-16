import { Router, type IRouter } from "express";
import { SubmitContactBody, SubmitContactResponse } from "@workspace/api-zod";
import { sendEmail, escapeHtml } from "../lib/email";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid submission" });
  }

  const { name, email, subject, message } = parsed.data;

  const html = `
    <div style="font-family: Helvetica, Arial, sans-serif; background:#0a0a0a; color:#f5f1e8; padding:24px;">
      <div style="max-width:600px; margin:0 auto; border:1px solid #c9a961; padding:24px;">
        <h2 style="color:#c9a961; letter-spacing:4px; font-weight:400; margin:0 0 16px;">ASSOCIATION WORLD — CONTACT</h2>
        <p><strong style="color:#c9a961;">Name:</strong> ${escapeHtml(name)}</p>
        <p><strong style="color:#c9a961;">Email:</strong> ${escapeHtml(email)}</p>
        <p><strong style="color:#c9a961;">Subject:</strong> ${escapeHtml(subject)}</p>
        <hr style="border:none; border-top:1px solid #c9a961; opacity:0.4; margin:16px 0;" />
        <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
      </div>
    </div>
  `;

  const result = await sendEmail({
    subject: `[Contact] ${subject} — ${name}`,
    html,
    replyTo: email,
  });

  if (!result.ok) {
    req.log.error({ err: result.error }, "Failed to send contact email");
    return res.status(500).json({ error: result.error ?? "Send failed" });
  }

  const data = SubmitContactResponse.parse({ ok: true });
  return res.json(data);
});

export default router;
