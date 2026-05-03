/**
 * Branded transactional email templates. Each template returns both an
 * HTML body and a plaintext fallback. Inline-styled (no external CSS) so
 * Gmail/Outlook render them faithfully.
 */

const BRAND_PRIMARY = "#7dd3fc";
const BRAND_DEEP    = "#0a0e1f";
const BRAND_INK     = "#e6e9f5";
const BRAND_MUTED   = "#9aa5c0";
const BRAND_BG      = "#050816";
const BRAND_SURFACE = "#0c1124";
const SITE_URL      = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nyxscholars.com";

interface BaseProps {
  preheader?: string;
  recipientName?: string;
}

export interface WelcomeProps extends BaseProps {
  ctaUrl: string;
}
export interface SessionReminderProps extends BaseProps {
  sessionDate: string;
  tutorName: string;
  joinUrl: string;
  minutesUntil: number;
}
export interface SessionSummaryProps extends BaseProps {
  sessionDate: string;
  tutorName: string;
  topicsCovered: string[];
  homework?: string[];
  portalUrl: string;
}
export interface PaymentReceiptProps extends BaseProps {
  amount: string;
  invoiceNumber: string;
  invoiceUrl: string;
  description: string;
}
export interface PaymentFailedProps extends BaseProps {
  amount: string;
  updateUrl: string;
}
export interface GiftCardDeliveryProps extends BaseProps {
  senderName: string;
  amount: string;
  code: string;
  message?: string;
  redeemUrl: string;
}
export interface ParentalConsentProps extends BaseProps {
  studentName: string;
  consentUrl: string;
}
export interface NpsRequestProps extends BaseProps {
  npsUrl: string;
}
export interface WeeklyDigestProps extends BaseProps {
  sessionsCompleted: number;
  upcomingSessions: number;
  scoreDelta?: number | null;
  portalUrl: string;
}

export type TemplatePropsMap = {
  "welcome":           WelcomeProps;
  "session.reminder":  SessionReminderProps;
  "session.summary":   SessionSummaryProps;
  "payment.receipt":   PaymentReceiptProps;
  "payment.failed":    PaymentFailedProps;
  "gift_card.delivery": GiftCardDeliveryProps;
  "parental.consent":  ParentalConsentProps;
  "nps.request":       NpsRequestProps;
  "weekly.digest":     WeeklyDigestProps;
};

export type TemplateName = keyof TemplatePropsMap;
export type TemplateProps<T extends TemplateName> = TemplatePropsMap[T];

interface Rendered { html: string; text: string }

export function renderTemplate<T extends TemplateName>(name: T, props: TemplateProps<T>): Rendered {
  switch (name) {
    case "welcome":             return welcome(props as WelcomeProps);
    case "session.reminder":    return sessionReminder(props as SessionReminderProps);
    case "session.summary":     return sessionSummary(props as SessionSummaryProps);
    case "payment.receipt":     return paymentReceipt(props as PaymentReceiptProps);
    case "payment.failed":      return paymentFailed(props as PaymentFailedProps);
    case "gift_card.delivery":  return giftCardDelivery(props as GiftCardDeliveryProps);
    case "parental.consent":    return parentalConsent(props as ParentalConsentProps);
    case "nps.request":         return npsRequest(props as NpsRequestProps);
    case "weekly.digest":       return weeklyDigest(props as WeeklyDigestProps);
  }
  return { html: "", text: "" };
}

// ─────────────────────────────────────────────────────────────────────────
// Layout primitives
// ─────────────────────────────────────────────────────────────────────────

function shell(props: { title: string; preheader?: string; body: string }): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${escapeHtml(props.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${BRAND_BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND_INK};">
    ${props.preheader ? `<div style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;mso-hide:all;">${escapeHtml(props.preheader)}</div>` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_BG};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:${BRAND_SURFACE};border:1px solid rgba(230,233,245,0.07);border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 0 28px;">
                <table role="presentation" width="100%"><tr>
                  <td>
                    <span style="display:inline-block;font-family:Georgia,serif;font-size:18px;letter-spacing:0.04em;color:${BRAND_INK};">Nyx</span>
                    <span style="display:inline-block;margin-left:8px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND_MUTED};">Scholars</span>
                  </td>
                </tr></table>
              </td>
            </tr>
            <tr><td style="padding:28px;color:${BRAND_INK};font-size:15px;line-height:1.6;">${props.body}</td></tr>
            <tr>
              <td style="padding:24px 28px 28px 28px;border-top:1px solid rgba(230,233,245,0.07);font-size:12px;color:${BRAND_MUTED};">
                Nyx Scholars · Princeton, NJ · <a href="${SITE_URL}" style="color:${BRAND_PRIMARY};">nyxscholars.com</a>
                <br />Need help? Reply to this email — a real person reads them.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function btn(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${BRAND_PRIMARY};color:${BRAND_DEEP};font-weight:700;text-decoration:none;padding:12px 22px;border-radius:12px;letter-spacing:0.02em;">${escapeHtml(label)}</a>`;
}

function muted(text: string): string {
  return `<span style="color:${BRAND_MUTED};">${escapeHtml(text)}</span>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

// ─────────────────────────────────────────────────────────────────────────
// Templates
// ─────────────────────────────────────────────────────────────────────────

function welcome(p: WelcomeProps): Rendered {
  const greet = p.recipientName ? `Welcome, ${p.recipientName}.` : "Welcome to Nyx.";
  const html = shell({
    title: "Welcome to Nyx Scholars",
    preheader: p.preheader ?? "Set your target test, take the intake, and meet your tutor.",
    body: `
      <h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 8px 0;color:${BRAND_INK};">${escapeHtml(greet)}</h1>
      <p>You're now in the portal. Your next steps:</p>
      <ol style="padding-left:20px;color:${BRAND_INK};">
        <li>Set your target test and goal score.</li>
        <li>Take the 14-question adaptive intake.</li>
        <li>Pick a slot with your matched tutor.</li>
      </ol>
      <p style="margin:28px 0;">${btn(p.ctaUrl, "Open the portal →")}</p>
      <p>${muted("Reply to this email any time — Maya, Ben, or one of the team will pick it up.")}</p>
    `,
  });
  const text = `${greet}\n\nNext steps:\n  1. Set target test\n  2. Take intake\n  3. Book a session\n\nOpen portal: ${p.ctaUrl}\n`;
  return { html, text };
}

function sessionReminder(p: SessionReminderProps): Rendered {
  const html = shell({
    title: `Your session with ${p.tutorName} starts in ${p.minutesUntil} minutes`,
    preheader: `Today, ${p.sessionDate}.`,
    body: `
      <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px 0;color:${BRAND_INK};">Session in ${p.minutesUntil} minutes</h1>
      <p>${escapeHtml(p.sessionDate)} with <strong style="color:${BRAND_INK};">${escapeHtml(p.tutorName)}</strong>.</p>
      <p style="margin:24px 0;">${btn(p.joinUrl, "Join the session →")}</p>
      <p>${muted("Tip: have your last practice set open in another tab so you and your tutor can pick up where you left off.")}</p>
    `,
  });
  const text = `Session in ${p.minutesUntil} minutes with ${p.tutorName} on ${p.sessionDate}.\nJoin: ${p.joinUrl}\n`;
  return { html, text };
}

function sessionSummary(p: SessionSummaryProps): Rendered {
  const topics = p.topicsCovered.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
  const homework = p.homework?.length
    ? `<h3 style="font-family:Georgia,serif;font-size:16px;margin:20px 0 8px 0;color:${BRAND_INK};">Practice for next time</h3><ul style="padding-left:20px;">${p.homework.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}</ul>`
    : "";
  const html = shell({
    title: `Recap from your session with ${p.tutorName}`,
    body: `
      <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px 0;color:${BRAND_INK};">Session recap</h1>
      <p>Here's what you covered with ${escapeHtml(p.tutorName)} on ${escapeHtml(p.sessionDate)}.</p>
      <h3 style="font-family:Georgia,serif;font-size:16px;margin:20px 0 8px 0;color:${BRAND_INK};">Topics covered</h3>
      <ul style="padding-left:20px;">${topics}</ul>
      ${homework}
      <p style="margin:24px 0;">${btn(p.portalUrl, "View in portal →")}</p>
    `,
  });
  const text = `Session recap with ${p.tutorName}\nTopics: ${p.topicsCovered.join(", ")}\n${p.homework?.length ? `Practice: ${p.homework.join(", ")}\n` : ""}Portal: ${p.portalUrl}\n`;
  return { html, text };
}

function paymentReceipt(p: PaymentReceiptProps): Rendered {
  const html = shell({
    title: `Receipt — ${p.amount}`,
    body: `
      <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px 0;color:${BRAND_INK};">Payment received</h1>
      <p>${escapeHtml(p.description)} — <strong>${escapeHtml(p.amount)}</strong></p>
      <p>Invoice ${escapeHtml(p.invoiceNumber)}.</p>
      <p style="margin:24px 0;">${btn(p.invoiceUrl, "Download invoice →")}</p>
    `,
  });
  const text = `Payment received — ${p.amount}\nInvoice ${p.invoiceNumber}: ${p.invoiceUrl}\n`;
  return { html, text };
}

function paymentFailed(p: PaymentFailedProps): Rendered {
  const html = shell({
    title: "Payment couldn't go through",
    body: `
      <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px 0;color:${BRAND_INK};">Card declined</h1>
      <p>Stripe couldn't process ${escapeHtml(p.amount)}. Update your payment method to keep your sessions on the calendar.</p>
      <p style="margin:24px 0;">${btn(p.updateUrl, "Update card →")}</p>
      <p>${muted("Reply if you need help — we won't cancel your plan without giving you a heads-up first.")}</p>
    `,
  });
  const text = `Card declined for ${p.amount}. Update your card: ${p.updateUrl}\n`;
  return { html, text };
}

function giftCardDelivery(p: GiftCardDeliveryProps): Rendered {
  const html = shell({
    title: `${p.senderName} sent you a Nyx gift card`,
    preheader: `${p.amount} toward 1:1 SAT/ACT/AP/admissions tutoring.`,
    body: `
      <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px 0;color:${BRAND_INK};">${escapeHtml(p.senderName)} sent you a Nyx gift card</h1>
      ${p.message ? `<p style="font-style:italic;color:${BRAND_MUTED};">"${escapeHtml(p.message)}"</p>` : ""}
      <p>Apply this code at checkout for <strong>${escapeHtml(p.amount)}</strong> off any plan:</p>
      <p style="font-family:'SFMono-Regular',Menlo,monospace;background:rgba(255,255,255,0.04);border:1px dashed rgba(125,211,252,0.4);border-radius:10px;padding:12px 16px;letter-spacing:0.18em;font-size:18px;text-align:center;">${escapeHtml(p.code)}</p>
      <p style="margin:24px 0;">${btn(p.redeemUrl, "Redeem now →")}</p>
    `,
  });
  const text = `${p.senderName} sent you a Nyx gift card (${p.amount}).\nCode: ${p.code}\nRedeem: ${p.redeemUrl}\n`;
  return { html, text };
}

function parentalConsent(p: ParentalConsentProps): Rendered {
  const html = shell({
    title: "Action needed: parental consent",
    body: `
      <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px 0;color:${BRAND_INK};">Confirm consent for ${escapeHtml(p.studentName)}</h1>
      <p>Because ${escapeHtml(p.studentName)} is under 13, we need a parent or guardian to grant consent (COPPA / FERPA) before they can use the portal.</p>
      <p style="margin:24px 0;">${btn(p.consentUrl, "Review and consent →")}</p>
      <p>${muted("This takes about 60 seconds. We don't sell or share your child's data.")}</p>
    `,
  });
  const text = `Please confirm consent for ${p.studentName}: ${p.consentUrl}\n`;
  return { html, text };
}

function npsRequest(p: NpsRequestProps): Rendered {
  const html = shell({
    title: "Quick favour — how likely are you to recommend Nyx?",
    body: `
      <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px 0;color:${BRAND_INK};">One question.</h1>
      <p>On a scale of 0–10, how likely are you to recommend Nyx to a friend? It takes ten seconds and shapes everything we build next.</p>
      <p style="margin:24px 0;">${btn(p.npsUrl, "Answer one question →")}</p>
    `,
  });
  return { html, text: `How likely are you to recommend Nyx? ${p.npsUrl}\n` };
}

function weeklyDigest(p: WeeklyDigestProps): Rendered {
  const delta = p.scoreDelta ? `<p>Predicted score is up <strong>${p.scoreDelta}</strong> points from last week.</p>` : "";
  const html = shell({
    title: "Your week on Nyx",
    body: `
      <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px 0;color:${BRAND_INK};">This week's recap</h1>
      <p>${p.sessionsCompleted} session${p.sessionsCompleted === 1 ? "" : "s"} completed · ${p.upcomingSessions} upcoming.</p>
      ${delta}
      <p style="margin:24px 0;">${btn(p.portalUrl, "Open the portal →")}</p>
    `,
  });
  return { html, text: `This week: ${p.sessionsCompleted} done, ${p.upcomingSessions} upcoming.\nPortal: ${p.portalUrl}\n` };
}
