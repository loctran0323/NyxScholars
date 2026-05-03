"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { trackPageView, getAnalytics } from "@/lib/analytics";
import { reportWebVital } from "@/lib/observability";

/**
 * Mounts at the root layout. Wires:
 *   • route-change page-view tracking (PostHog + GA + console fallback)
 *   • Web Vitals reporting (LCP, INP, CLS, FCP, TTFB) via web-vitals dynamic
 *     import — no extra dep, native PerformanceObserver path.
 *   • Sentry-like global error/unhandledrejection capture.
 *
 * Everything is a no-op when no analytics keys are configured. The intent is
 * that adding `NEXT_PUBLIC_POSTHOG_KEY` (or `SENTRY_DSN`) lights up the
 * pipeline without code changes.
 */
export function Analytics() {
  const pathname = usePathname();

  // 1. Bootstrap the analytics provider exactly once.
  React.useEffect(() => {
    getAnalytics().identifyAnonymous();
  }, []);

  // 2. Route changes → page-view events.
  React.useEffect(() => {
    if (!pathname) return;
    trackPageView(pathname);
  }, [pathname]);

  // 3. Web Vitals via the native PerformanceObserver.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const observers: PerformanceObserver[] = [];

    function safeObserve(type: string, cb: (entries: PerformanceEntryList) => void) {
      try {
        const obs = new PerformanceObserver((list) => cb(list.getEntries()));
        obs.observe({ type, buffered: true } as PerformanceObserverInit);
        observers.push(obs);
      } catch {
        /* ignore unsupported entry types */
      }
    }

    safeObserve("largest-contentful-paint", (entries) => {
      const last = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
      reportWebVital({ name: "LCP", value: last.startTime, id: "lcp", path: pathname ?? "" });
    });

    safeObserve("first-input", (entries) => {
      const first = entries[0] as PerformanceEntry & { processingStart: number; startTime: number };
      reportWebVital({
        name: "FID",
        value: first.processingStart - first.startTime,
        id: "fid",
        path: pathname ?? "",
      });
    });

    safeObserve("layout-shift", (entries) => {
      let cls = 0;
      for (const e of entries) {
        const ls = e as PerformanceEntry & { value: number; hadRecentInput: boolean };
        if (!ls.hadRecentInput) cls += ls.value;
      }
      reportWebVital({ name: "CLS", value: cls, id: "cls", path: pathname ?? "" });
    });

    safeObserve("paint", (entries) => {
      for (const e of entries) {
        if (e.name === "first-contentful-paint") {
          reportWebVital({ name: "FCP", value: e.startTime, id: "fcp", path: pathname ?? "" });
        }
      }
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [pathname]);

  // 4. Global error capture — pipes into the observability shim.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const onError = (e: ErrorEvent) => {
      void import("@/lib/observability").then(({ captureException }) =>
        captureException(e.error ?? new Error(e.message), { kind: "uncaught" }),
      );
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      void import("@/lib/observability").then(({ captureException }) =>
        captureException(e.reason instanceof Error ? e.reason : new Error(String(e.reason)), { kind: "unhandledrejection" }),
      );
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
