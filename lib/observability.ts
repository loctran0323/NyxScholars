/**
 * Observability adapter — Sentry-shaped surface that no-ops when no DSN
 * is configured. When `NEXT_PUBLIC_SENTRY_DSN` is set, captured events
 * forward to a tiny envelope endpoint at `/api/log` (Vercel/Cloudflare-
 * friendly) which then fans them out to whatever back-end is wired.
 *
 * Plus a Web Vitals reporter that funnels into the same pipeline AND
 * mirrors to PostHog/GA when they are present.
 */

import { track } from "@/lib/analytics";

interface ExtraContext {
  [key: string]: unknown;
}

interface VitalReport {
  name: "LCP" | "FID" | "CLS" | "FCP" | "TTFB" | "INP";
  value: number;
  id: string;
  path: string;
}

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const RELEASE = process.env.NEXT_PUBLIC_RELEASE ?? "dev";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safePost(payload: unknown) {
  if (!isBrowser()) return;
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/log", new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    /* logging itself must never throw */
  }
}

export function captureException(err: unknown, context?: ExtraContext) {
  const error = err instanceof Error ? err : new Error(String(err));
  const payload = {
    type: "exception",
    release: RELEASE,
    name: error.name,
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    path: isBrowser() ? window.location.pathname : undefined,
    userAgent: isBrowser() ? navigator.userAgent : undefined,
  };

  if (process.env.NODE_ENV !== "production") {
    console.error("[observability] captureException", payload);
  }

  if (DSN) safePost(payload);
}

export function captureMessage(message: string, context?: ExtraContext) {
  const payload = {
    type: "message",
    release: RELEASE,
    message,
    context,
    timestamp: new Date().toISOString(),
    path: isBrowser() ? window.location.pathname : undefined,
  };

  if (process.env.NODE_ENV !== "production") {
    console.info("[observability] captureMessage", payload);
  }

  if (DSN) safePost(payload);
}

export function reportWebVital(vital: VitalReport) {
  // Mirror to analytics provider for funnel + perf joins.
  track("web_vital", {
    name: vital.name,
    value: Math.round(vital.value * 100) / 100,
    path: vital.path,
  });

  if (DSN) {
    safePost({
      type: "web_vital",
      release: RELEASE,
      ...vital,
      timestamp: new Date().toISOString(),
    });
  }

  if (process.env.NODE_ENV !== "production") {
    console.debug("[web-vitals]", vital.name, Math.round(vital.value), vital.path);
  }
}
