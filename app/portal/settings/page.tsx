import type { Metadata } from "next";
import { SettingsPanel } from "./SettingsPanel";

export const metadata: Metadata = {
  title: "Settings",
  description: "Display, motion, and notification preferences for your Nyx portal.",
};

export default function SettingsPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-7">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Portal</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)] leading-tight">Settings</h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Personalize how Nyx looks, moves, and reaches you. Saved on this device.
        </p>
      </div>
      <SettingsPanel />
    </div>
  );
}
