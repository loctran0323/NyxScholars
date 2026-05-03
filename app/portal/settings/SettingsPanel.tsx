"use client";

import * as React from "react";
import { Monitor, Sun, Moon, Rows3, Rows2, Eye, ZapOff, Bell, MessageSquare, Mail, Phone, Calendar, GraduationCap } from "lucide-react";
import { usePreferences, type ThemeMode, type Density, type Contrast, type Motion } from "@/components/system/ThemeProvider";
import { useToast } from "@/components/system/Toast";
import { track, EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function SettingsPanel() {
  const prefs = usePreferences();
  const { toast } = useToast();

  function announce(label: string) {
    toast({ title: "Preference saved", description: label, variant: "success", durationMs: 2000 });
  }

  return (
    <div className="space-y-6">
      <Section title="Appearance" description="How the Nyx portal looks on this device.">
        <Row label="Theme" hint="`System` follows your operating system colour scheme.">
          <SegmentedControl<ThemeMode>
            value={prefs.theme}
            onChange={(v) => {
              prefs.setTheme(v);
              track(EVENTS.PREF_CHANGED, { pref: "theme", value: v });
              announce(`Theme set to ${v}.`);
            }}
            options={[
              { value: "dark",   label: "Dark",   icon: Moon },
              { value: "light",  label: "Light",  icon: Sun },
              { value: "system", label: "System", icon: Monitor },
            ]}
          />
        </Row>
        <Row label="Density" hint="Compact tightens spacing throughout the portal.">
          <SegmentedControl<Density>
            value={prefs.density}
            onChange={(v) => {
              prefs.setDensity(v);
              track(EVENTS.PREF_CHANGED, { pref: "density", value: v });
              announce(`Density set to ${v}.`);
            }}
            options={[
              { value: "comfortable", label: "Comfortable", icon: Rows3 },
              { value: "compact",     label: "Compact",     icon: Rows2 },
            ]}
          />
        </Row>
        <Row label="Contrast" hint="Boosts borders and dim text for low-vision readability.">
          <SegmentedControl<Contrast>
            value={prefs.contrast}
            onChange={(v) => {
              prefs.setContrast(v);
              track(EVENTS.PREF_CHANGED, { pref: "contrast", value: v });
              announce(`Contrast set to ${v}.`);
            }}
            options={[
              { value: "normal", label: "Normal", icon: Eye },
              { value: "high",   label: "High",   icon: Eye },
            ]}
          />
        </Row>
      </Section>

      <Section title="Motion" description="Animations honour OS-level reduced motion automatically.">
        <Row label="Animation" hint="`Reduced` flattens transitions even when your OS doesn't request it.">
          <SegmentedControl<Motion>
            value={prefs.motion}
            onChange={(v) => {
              prefs.setMotion(v);
              track(EVENTS.PREF_CHANGED, { pref: "motion", value: v });
              announce(`Motion set to ${v}.`);
            }}
            options={[
              { value: "system",  label: "System default", icon: Monitor },
              { value: "reduced", label: "Reduced",        icon: ZapOff  },
            ]}
          />
        </Row>
      </Section>

      <NotificationsSection />
    </div>
  );
}

function NotificationsSection() {
  const { toast } = useToast();
  const [prefs, setPrefs] = React.useState<NotifPrefs>(() => readNotifPrefs());

  function update(patch: Partial<NotifPrefs>) {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    writeNotifPrefs(next);
    toast({ title: "Notification preference saved", variant: "success", durationMs: 1800 });
  }

  return (
    <Section title="Notifications" description="Pick the channels we use to remind you about sessions, messages, and milestones.">
      <Row label="Session reminders" hint="24h-before and 1h-before nudges for upcoming sessions.">
        <ChannelGroup
          email={prefs.session.email}
          push={prefs.session.push}
          sms={prefs.session.sms}
          onChange={(c, v) => update({ session: { ...prefs.session, [c]: v } })}
        />
      </Row>
      <Row label="Tutor messages" hint="When your tutor or the Nyx team sends you a message.">
        <ChannelGroup
          email={prefs.messages.email}
          push={prefs.messages.push}
          sms={prefs.messages.sms}
          onChange={(c, v) => update({ messages: { ...prefs.messages, [c]: v } })}
        />
      </Row>
      <Row label="Weekly digest" hint="A Sunday morning summary of what you did and what's next.">
        <ChannelGroup
          email={prefs.digest.email}
          push={prefs.digest.push}
          sms={prefs.digest.sms}
          onChange={(c, v) => update({ digest: { ...prefs.digest, [c]: v } })}
        />
      </Row>
      <Row label="Marketing" hint="New features, study tips, exam-day playbooks. Off by default.">
        <ChannelGroup
          email={prefs.marketing.email}
          push={prefs.marketing.push}
          sms={prefs.marketing.sms}
          onChange={(c, v) => update({ marketing: { ...prefs.marketing, [c]: v } })}
        />
      </Row>
    </Section>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <header className="px-6 py-5 border-b border-[var(--border)]">
        <h2 className="text-[15.5px] font-semibold text-[var(--text-1)]">{title}</h2>
        <p className="text-[13px] text-[var(--text-2)] mt-0.5 leading-relaxed">{description}</p>
      </header>
      <div className="divide-y divide-[var(--border)]">{children}</div>
    </section>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-5 grid md:grid-cols-[220px_1fr] gap-3 md:items-start">
      <div>
        <p className="text-[13.5px] font-semibold text-[var(--text-1)]">{label}</p>
        {hint && <p className="text-[12.5px] text-[var(--text-3)] mt-0.5 leading-snug">{hint}</p>}
      </div>
      <div className="md:flex md:justify-end">{children}</div>
    </div>
  );
}

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[];
}) {
  return (
    <div
      role="radiogroup"
      aria-label="preference"
      className="inline-flex gap-1 rounded-xl bg-[var(--bg-2)] p-1 border border-[var(--border)]"
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors",
              active
                ? "bg-[var(--surface)] text-[var(--text-1)] border border-[var(--border-2)]"
                : "text-[var(--text-2)] hover:text-[var(--text-1)] border border-transparent",
            )}
          >
            <Icon size={13} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function ChannelGroup({
  email,
  push,
  sms,
  onChange,
}: {
  email: boolean;
  push: boolean;
  sms: boolean;
  onChange: (channel: "email" | "push" | "sms", value: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <ChannelToggle label="Email"  icon={Mail}  value={email} onChange={(v) => onChange("email", v)} />
      <ChannelToggle label="Push"   icon={Bell}  value={push}  onChange={(v) => onChange("push",  v)} />
      <ChannelToggle label="SMS"    icon={Phone} value={sms}   onChange={(v) => onChange("sms",   v)} />
    </div>
  );
}

function ChannelToggle({
  label,
  icon: Icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors",
        value
          ? "bg-[var(--accent-dim)] border-[var(--border-accent)] text-[var(--accent)]"
          : "bg-transparent border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--border-2)]",
      )}
    >
      <Icon size={12} />
      {label}
    </button>
  );
}

interface ChannelPrefs { email: boolean; push: boolean; sms: boolean }
interface NotifPrefs {
  session:   ChannelPrefs;
  messages:  ChannelPrefs;
  digest:    ChannelPrefs;
  marketing: ChannelPrefs;
}
const NOTIF_KEY = "nyx:notifs:v1";
const NOTIF_DEFAULTS: NotifPrefs = {
  session:   { email: true,  push: true,  sms: false },
  messages:  { email: true,  push: true,  sms: false },
  digest:    { email: true,  push: false, sms: false },
  marketing: { email: false, push: false, sms: false },
};
function readNotifPrefs(): NotifPrefs {
  if (typeof window === "undefined") return NOTIF_DEFAULTS;
  try {
    const raw = window.localStorage.getItem(NOTIF_KEY);
    if (!raw) return NOTIF_DEFAULTS;
    const parsed = JSON.parse(raw) as NotifPrefs;
    return { ...NOTIF_DEFAULTS, ...parsed };
  } catch {
    return NOTIF_DEFAULTS;
  }
}
function writeNotifPrefs(p: NotifPrefs) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(NOTIF_KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

// Re-exports so other surfaces can read the same prefs without duplicating keys.
export const NotificationKeys = { storageKey: NOTIF_KEY, defaults: NOTIF_DEFAULTS };
export type { NotifPrefs };
