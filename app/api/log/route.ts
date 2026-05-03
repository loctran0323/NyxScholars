import { NextRequest, NextResponse } from "next/server";

/**
 * Single envelope endpoint for client-side observability events.
 * In production, forward to Sentry, Logtail, Axiom, etc. by setting
 * SENTRY_INGEST_URL / LOGTAIL_TOKEN. With nothing configured, log
 * to the server console so events still surface in Vercel logs.
 */
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let payload: unknown = null;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ingestUrl = process.env.SENTRY_INGEST_URL;
  const logtailToken = process.env.LOGTAIL_TOKEN;

  if (ingestUrl) {
    void fetch(ingestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  if (logtailToken) {
    void fetch("https://in.logtail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logtailToken}`,
      },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  if (!ingestUrl && !logtailToken) {
    console.log("[observe]", JSON.stringify(payload));
  }

  return NextResponse.json({ ok: true });
}
