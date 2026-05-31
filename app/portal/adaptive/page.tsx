import type { Metadata } from "next";
import { AdaptiveRunner } from "./AdaptiveRunner";

export const metadata: Metadata = {
  title: "Endless practice · Nyx Scholars",
  description: "Infinite, self-adjusting SAT practice that matches every question to your current level.",
};

export default function AdaptivePage() {
  return <AdaptiveRunner />;
}
