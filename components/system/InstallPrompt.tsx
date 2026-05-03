"use client";

import * as React from "react";
import { Download, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

interface BeforeInstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY = "nyx:install:dismissed_at";
const COOLDOWN_DAYS = 30;

/**
 * Listens for `beforeinstallprompt` and surfaces a non-intrusive PWA
 * install banner. Dismissed for 30 days at a time. iOS Safari doesn't
 * fire the event, so we never display on iOS — they have to use the
 * native share-sheet "Add to home screen" path which we document in the
 * portal settings page.
 */
export function InstallPrompt() {
  const [event, setEvent] = React.useState<BeforeInstallEvent | null>(null);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const last = window.localStorage.getItem(STORAGE_KEY);
      if (last && Date.now() - Number(last) < COOLDOWN_DAYS * 24 * 3600 * 1000) {
        setDismissed(true);
      }
    } catch { /* ignore */ }

    const handler = (e: Event) => {
      e.preventDefault();
      setEvent(e as BeforeInstallEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!event || dismissed) return null;

  function dismiss() {
    setDismissed(true);
    try { window.localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch { /* ignore */ }
    track("pwa.install.dismissed");
  }

  async function install() {
    if (!event) return;
    await event.prompt();
    const choice = await event.userChoice;
    track("pwa.install.choice", { outcome: choice.outcome });
    if (choice.outcome === "accepted") {
      setDismissed(true);
    } else {
      dismiss();
    }
    setEvent(null);
  }

  return (
    <div
      role="region"
      aria-label="Install Nyx app"
      className={cn(
        "fixed bottom-5 right-5 z-[105] max-w-xs rounded-2xl border border-[var(--border-accent)] bg-[var(--surface-elevated)] p-4 shadow-[0_18px_36px_rgba(0,0,0,0.5)]",
        "animate-[slide-up-in_0.3s_var(--ease-out-soft)]",
      )}
    >
      <button
        aria-label="Dismiss install prompt"
        onClick={dismiss}
        className="absolute right-2.5 top-2.5 text-[var(--text-3)] hover:text-[var(--text-1)]"
      >
        <X size={13} />
      </button>
      <div className="flex items-center gap-2 mb-1.5">
        <Download size={13} className="text-[var(--accent)]" />
        <p className="text-[12px] uppercase tracking-wider text-[var(--accent)] font-semibold">
          Install Nyx
        </p>
      </div>
      <p className="text-[13px] text-[var(--text-1)] leading-snug">
        Add Nyx to your device for one-tap access to sessions, messages, and your daily 8 minutes.
      </p>
      <button
        onClick={install}
        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--gold-soft)] text-[var(--on-gold)] font-semibold text-[12px]"
      >
        <Download size={12} /> Install
      </button>
    </div>
  );
}
