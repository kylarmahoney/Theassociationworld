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
    duration,
    city,
    country,
    venueName,
    venueDirections,
    artist,
    budget,
    downPayment,
    details,
    waiverAccepted,
  } = parsed.data;

  if (!waiverAccepted) {
    return res.status(400).json({ error: "Waiver must be accepted" });
  }

  const row = (label: string, value?: string) =>
    value
      ? `<p style="margin:6px 0;"><strong style="color:#c9a961;">${label}:</strong> ${escapeHtml(value)}</p>`
      : "";

  const waiverText = `By submitting this booking, the client acknowledges and agrees to the following: (1) Equipment liability — the client assumes full financial responsibility for any Association World DJ equipment that is damaged by water, spills, mishandling, or other damage while at the client's venue, and will pay the full cost of repair or replacement. (2) Performance injury release — the client releases Association World, its DJs, and artists from liability for any injuries sustained by performing artists at the client's venue or in the course of performance, and the client agrees to maintain a safe performance environment.`;

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
        ${row("Duration", duration)}
        <hr style="border:none; border-top:1px solid #c9a961; opacity:0.4; margin:16px 0;" />
        ${row("City", city)}
        ${row("Country", country)}
        ${row("Venue Name", venueName)}
        ${row("Directions", venueDirections)}
        <hr style="border:none; border-top:1px solid #c9a961; opacity:0.4; margin:16px 0;" />
        ${row("Down Payment", downPayment)}
        ${row("Budget", budget)}
        ${
          details
            ? `<hr style="border:none; border-top:1px solid #c9a961; opacity:0.4; margin:16px 0;" />
               <p style="margin:6px 0;"><strong style="color:#c9a961;">Details:</strong></p>
               <p style="white-space:pre-wrap; margin:6px 0;">${escapeHtml(details)}</p>`
            : ""
        }
        <hr style="border:none; border-top:1px solid #c9a961; opacity:0.4; margin:16px 0;" />
        <p style="margin:6px 0;"><strong style="color:#c9a961;">Waiver accepted:</strong> YES</p>
        <p style="font-size:11px; line-height:1.6; color:#bfb38f; margin:8px 0 0;">${escapeHtml(waiverText)}</p>
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
