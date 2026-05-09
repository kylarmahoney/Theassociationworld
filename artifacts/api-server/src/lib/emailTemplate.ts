import { escapeHtml, MANAGEMENT_EMAIL } from "./email";

const GOLD = "#c9a961";
const GOLD_LIGHT = "#f5e6b8";
const GOLD_DARK = "#8a6f2e";
const PARCHMENT = "#f5f1e8";
const MUTED = "#a89e84";
const BG = "#0a0a0a";
const PANEL = "#111111";
const BORDER = "rgba(201,169,97,0.35)";

export type EmailField = {
  label: string;
  value?: string | null;
  multiline?: boolean;
  highlight?: boolean;
};

export type EmailSection = {
  heading: string;
  fields?: EmailField[];
  body?: string;
  note?: string;
};

const renderField = (f: EmailField): string => {
  const v = (f.value ?? "").toString().trim();
  if (!v) return "";
  const valueHtml = f.multiline
    ? `<div style="white-space:pre-wrap; color:${PARCHMENT}; font-size:14px; line-height:1.7;">${escapeHtml(v)}</div>`
    : `<span style="color:${f.highlight ? GOLD_LIGHT : PARCHMENT}; font-size:14px; line-height:1.6;${f.highlight ? " font-weight:600;" : ""}">${escapeHtml(v)}</span>`;
  return `
    <tr>
      <td style="padding:10px 0; vertical-align:top; width:38%;">
        <span style="color:${GOLD}; font-size:10px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">${escapeHtml(f.label)}</span>
      </td>
      <td style="padding:10px 0 10px 16px; vertical-align:top; border-left:1px solid ${BORDER};">
        ${valueHtml}
      </td>
    </tr>`;
};

const renderSection = (s: EmailSection): string => {
  const fields = (s.fields ?? []).map(renderField).join("");
  if (!fields && !s.body && !s.note) return "";
  return `
    <tr>
      <td style="padding:0 32px 8px;">
        <div style="border-top:1px solid ${BORDER}; padding-top:24px; margin-top:8px;">
          <p style="margin:0 0 14px; color:${GOLD}; font-family: Georgia, 'Times New Roman', serif; font-size:13px; letter-spacing:6px; text-transform:uppercase;">${escapeHtml(s.heading)}</p>
          ${fields ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">${fields}</table>` : ""}
          ${s.body ? `<div style="margin-top:8px; color:${PARCHMENT}; font-size:14px; line-height:1.7; white-space:pre-wrap;">${escapeHtml(s.body)}</div>` : ""}
          ${s.note ? `<p style="margin:14px 0 0; color:${MUTED}; font-size:11px; line-height:1.7; font-style:italic;">${escapeHtml(s.note)}</p>` : ""}
        </div>
      </td>
    </tr>`;
};

export type EmailTemplateOptions = {
  preheader: string;
  eyebrow: string;
  title: string;
  intro?: string;
  badge?: string;
  sections: EmailSection[];
  replyEmail?: string;
};

export function renderEmail(opts: EmailTemplateOptions): string {
  const sectionsHtml = opts.sections.map(renderSection).join("");
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="dark" />
<meta name="supported-color-schemes" content="dark" />
<title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0; padding:0; background:${BG}; color:${PARCHMENT}; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
<div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">${escapeHtml(opts.preheader)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG}; padding:32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px; background:${PANEL}; border:1px solid ${BORDER}; box-shadow:0 30px 60px -20px rgba(0,0,0,0.8);">
        <!-- Header -->
        <tr>
          <td style="padding:36px 32px 28px; text-align:center; border-bottom:1px solid ${BORDER}; background:linear-gradient(180deg, rgba(201,169,97,0.08), transparent);">
            <p style="margin:0; color:${MUTED}; font-size:10px; letter-spacing:6px; text-transform:uppercase;">Est. MMXXV · The Collective</p>
            <h1 style="margin:14px 0 6px; font-family: Georgia, 'Times New Roman', serif; font-size:28px; letter-spacing:8px; text-transform:uppercase; color:${GOLD_LIGHT}; font-weight:400;">Association World</h1>
            <div style="height:1px; width:80px; margin:18px auto; background:linear-gradient(90deg, transparent, ${GOLD}, transparent);"></div>
            <p style="margin:0; color:${GOLD}; font-size:11px; letter-spacing:5px; text-transform:uppercase; font-weight:600;">${escapeHtml(opts.eyebrow)}</p>
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td style="padding:32px 32px 8px; text-align:center;">
            <h2 style="margin:0; font-family: Georgia, 'Times New Roman', serif; font-size:22px; line-height:1.4; color:${PARCHMENT}; font-weight:400; letter-spacing:1px;">${escapeHtml(opts.title)}</h2>
            ${opts.badge ? `<p style="display:inline-block; margin:18px 0 0; padding:6px 14px; border:1px solid ${GOLD}; color:${GOLD}; font-size:10px; letter-spacing:4px; text-transform:uppercase;">${escapeHtml(opts.badge)}</p>` : ""}
            ${opts.intro ? `<p style="margin:18px auto 0; max-width:480px; color:${MUTED}; font-size:14px; line-height:1.7;">${escapeHtml(opts.intro)}</p>` : ""}
          </td>
        </tr>

        <tr><td style="padding:16px 0;"></td></tr>

        ${sectionsHtml}

        <!-- Reply CTA -->
        ${
          opts.replyEmail
            ? `<tr>
                <td style="padding:24px 32px 8px;">
                  <div style="border-top:1px solid ${BORDER}; padding-top:24px; text-align:center;">
                    <p style="margin:0 0 14px; color:${MUTED}; font-size:11px; letter-spacing:3px; text-transform:uppercase;">Reply directly to the sender</p>
                    <a href="mailto:${escapeHtml(opts.replyEmail)}" style="display:inline-block; padding:12px 28px; border:1px solid ${GOLD}; color:${GOLD_LIGHT}; text-decoration:none; font-size:11px; letter-spacing:4px; text-transform:uppercase;">Reply to ${escapeHtml(opts.replyEmail)}</a>
                  </div>
                </td>
              </tr>`
            : ""
        }

        <!-- Footer -->
        <tr>
          <td style="padding:36px 32px 28px; border-top:1px solid ${BORDER}; background:linear-gradient(0deg, rgba(201,169,97,0.05), transparent); text-align:center;">
            <p style="margin:0; color:${GOLD}; font-family: Georgia, 'Times New Roman', serif; font-size:14px; letter-spacing:5px; text-transform:uppercase;">Bound by Silence</p>
            <div style="height:1px; width:60px; margin:14px auto; background:linear-gradient(90deg, transparent, ${GOLD_DARK}, transparent);"></div>
            <p style="margin:0; color:${MUTED}; font-size:11px; line-height:1.8;">
              Association World · The Collective<br/>
              <a href="mailto:${MANAGEMENT_EMAIL}" style="color:${GOLD}; text-decoration:none;">${MANAGEMENT_EMAIL}</a>
            </p>
            <p style="margin:18px 0 0; color:${MUTED}; opacity:0.6; font-size:10px; letter-spacing:2px; text-transform:uppercase;">© ${year} Association World · All Rights Reserved</p>
          </td>
        </tr>
      </table>

      <p style="max-width:640px; margin:18px auto 0; color:${MUTED}; opacity:0.5; font-size:10px; line-height:1.6; text-align:center;">
        This message was generated from a form submission on theassociationworld.com. Forwarded to ${MANAGEMENT_EMAIL} for review.
      </p>
    </td>
  </tr>
</table>
</body>
</html>`;
}
