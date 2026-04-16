import { Router, type IRouter } from "express";
import { SubmitBookingBody, SubmitBookingResponse } from "@workspace/api-zod";
import { sendEmail, escapeHtml } from "../lib/email";

const router: IRouter = Router();

router.post("/booking", async (req, res) => {
  const parsed = SubmitBookingBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid submission" });
  }

  const {
    name,
    email,
    phone,
    eventType,
    eventDate,
    eventLocation,
    artist,
    budget,
    details,
  } = parsed.data;

  const row = (label: string, value?: string) =>
    value
      ? `<p><strong style="color:#c9a961;">${label}:</strong> ${escapeHtml(value)}</p>`
      : "";

  const html = `
    <div style="font-family: Helvetica, Arial, sans-serif; background:#0a0a0a; color:#f5f1e8; padding:24px;">
      <div style="max-width:600px; margin:0 auto; border:1px solid #c9a961; padding:24px;">
        <h2 style="color:#c9a961; letter-spacing:4px; font-weight:400; margin:0 0 16px;">ASSOCIATION WORLD — BOOKING REQUEST</h2>
        ${row("Name", name)}
        ${row("Email", email)}
        ${row("Phone", phone)}
        <hr style="border:none; border-top:1px solid #c9a961; opacity:0.4; margin:16px 0;" />
        ${row("Artist", artist)}
        ${row("Event Type", eventType)}
        ${row("Event Date", eventDate)}
        ${row("Event Location", eventLocation)}
        ${row("Budget", budget)}
        ${
          details
            ? `<hr style="border:none; border-top:1px solid #c9a961; opacity:0.4; margin:16px 0;" />
               <p><strong style="color:#c9a961;">Details:</strong></p>
               <p style="white-space:pre-wrap;">${escapeHtml(details)}</p>`
            : ""
        }
      </div>
    </div>
  `;

  const result = await sendEmail({
    subject: `[Booking] ${artist} — ${eventType} — ${name}`,
    html,
    replyTo: email,
  });

  if (!result.ok) {
    req.log.error({ err: result.error }, "Failed to send booking email");
    return res.status(500).json({ error: result.error ?? "Send failed" });
  }

  const data = SubmitBookingResponse.parse({ ok: true });
  return res.json(data);
});

export default router;
