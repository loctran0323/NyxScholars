"use client";

import * as React from "react";

/**
 * Fires the welcome email on first portal visit. Idempotent — the
 * server-side endpoint dedupes via `notif_prefs.welcome_sent_at`.
 */
export function WelcomeBootstrap() {
  React.useEffect(() => {
    void fetch("/api/portal/welcome", { method: "POST" }).catch(() => {});
  }, []);
  return null;
}
