import type { SessionStatus } from "@/types/portal";

/**
 * Map a session status to its Badge variant. Single source of truth so the
 * dashboard, sessions list, and sessions detail page never drift apart.
 */
export function sessionStatusVariant(status: SessionStatus | string): "gold" | "blue" | "green" | "red" | "default" {
  switch (status) {
    case "confirmed": return "blue";
    case "completed": return "green";
    case "cancelled": return "red";
    case "pending":   return "gold";
    default:          return "default";
  }
}

/** Display label for the four-tier student plan field. */
export function planLabel(plan: string | null | undefined): string {
  switch (plan) {
    case "session":    return "Session · pay as you go";
    case "monthly":    return "Scholar · 4 sessions / month";
    case "counseling": return "Concierge · custom-quoted";
    default:           return "Trial — choose a plan to begin";
  }
}

/** Two-letter initials from a full name, "?" when empty. */
export function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
