/**
 * Branded transactional email helper. Resend-shaped API. No-ops when
 * RESEND_API_KEY isn't set, so the rest of the app doesn't crash.
 *
 * Templates live in lib/email-templates/* and produce inline HTML so we
 * don't need a separate React Email build step.
 */

import { renderTemplate, type TemplateName, type TemplateProps } from "@/lib/email-templates";

interface SendInput<T extends TemplateName> {
  to: string;
  subject: string;
  template: T;
  props: TemplateProps<T>;
  /** Reply-To override (defaults to hello@nyxscholars.com). */
  replyTo?: string;
}

const FROM = process.env.EMAIL_FROM ?? "Nyx Scholars <hello@nyxscholars.com>";
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? "hello@nyxscholars.com";

export async function sendEmail<T extends TemplateName>(input: SendInput<T>): Promise<{ ok: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const { html, text } = renderTemplate(input.template, input.props);

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[email:dev]", JSON.stringify({ to: input.to, subject: input.subject, template: input.template }));
    }
    return { ok: true, id: "dev-mock" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:     FROM,
        to:       [input.to],
        subject:  input.subject,
        html,
        text,
        reply_to: input.replyTo ?? REPLY_TO,
      }),
    });
    if (!res.ok) {
      const error = await res.text();
      return { ok: false, error };
    }
    const data = (await res.json()) as { id?: string };
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Email send failed" };
  }
}
