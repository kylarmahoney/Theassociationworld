import { Router, type IRouter } from "express";
import { SubmitContactBody, SubmitContactResponse } from "@workspace/api-zod";
import { sendEmail } from "../lib/email";
import { renderEmail } from "../lib/emailTemplate";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid submission" });
  }

  const { name, email, subject, message } = parsed.data;

  const html = renderEmail({
    preheader: `${subject} — from ${name}`,
    eyebrow: "New Contact Message",
    title: subject,
    intro: "A new message has been submitted through the contact form on associationworld.com.",
    badge: "Contact",
    sections: [
      {
        heading: "From",
        fields: [
          { label: "Name", value: name, highlight: true },
          { label: "Email", value: email },
          { label: "Subject", value: subject },
        ],
      },
      {
        heading: "Message",
        body: message,
      },
    ],
    replyEmail: email,
  });

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
