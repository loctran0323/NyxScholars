import type { Metadata } from "next";
import { SettingsPanel } from "./SettingsPanel";
import { PortalHero } from "@/components/portal/PortalHero";

export const metadata: Metadata = {
  title: "Settings",
  description: "Display, motion, and notification preferences for your Nyx portal.",
};

export default function SettingsPage() {
  return (
    <div className="max-w-3xl">
      <PortalHero
        eyebrow="Portal"
        title="Settings"
        italic="how Nyx feels"
        subtitle="Personalize how Nyx looks, moves, and reaches you. Saved on this device."
      />
      <SettingsPanel />
    </div>
  );
}
