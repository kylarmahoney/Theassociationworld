import { Resend } from "resend";
import { logger } from "./logger";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export const MANAGEMENT_EMAIL = "management@associationworld.com";

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Association World <onboarding@resend.dev>";

export async function sendEmail(params: {
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!resend) {
    logger.error("RESEND_API_KEY is not configured");
    return { ok: false, error: "Email service not configured" };
  }

  const toAddress = process.env.EMAIL_TO_OVERRIDE?.trim() || MANAGEMENT_EMAIL;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toAddress],
      subject: params.subject,
      html: params.html,
      replyTo: params.replyTo,
    });

    if (error) {
      logger.error({ err: error }, "Resend returned an error");
      return { ok: false, error: error.message ?? "Email send failed" };
    }

    return { ok: true };
  } catch (err) {
    logger.error({ err }, "Email send threw");
    return { ok: false, error: "Email send failed" };
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
