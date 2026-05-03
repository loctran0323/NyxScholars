"use client";

import * as React from "react";

/** Registers the service worker on first paint. No-op in dev. */
export function PwaRegister() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
