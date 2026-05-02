/**
 * Single source of truth for Nyx pricing.
 * One rate. Three optional weekly-cadence packages.
 */

export const HOURLY_RATE = 160;
export const TRIAL_MINUTES = 30;

export type Package = {
  id: "month" | "two-month" | "three-month";
  name: string;
  weeks: number;
  hoursPerWeek: 2;
  totalHours: number;
  /** Effective hourly rate after the package discount. */
  effectiveHourly: number;
  /** Total flat price the student pays upfront. */
  totalPrice: number;
  discountPct: number;
  summary: string;
  /** Whether this is the recommended middle option. */
  recommended?: boolean;
};

/** Weekly-cadence packages — 2 hours per week for N weeks. */
export const PACKAGES: Package[] = [
  {
    id: "month",
    name: "Monthly Cadence",
    weeks: 4,
    hoursPerWeek: 2,
    totalHours: 8,
    effectiveHourly: 150,        // ~6% off
    totalPrice: 1200,
    discountPct: 6,
    summary: "Two 60-minute sessions a week for four weeks. The sampler.",
  },
  {
    id: "two-month",
    name: "Two-Month Cadence",
    weeks: 8,
    hoursPerWeek: 2,
    totalHours: 16,
    effectiveHourly: 140,        // ~12% off
    totalPrice: 2240,
    discountPct: 12,
    summary: "Two sessions a week for eight weeks. Most students start here.",
    recommended: true,
  },
  {
    id: "three-month",
    name: "Three-Month Cadence",
    weeks: 12,
    hoursPerWeek: 2,
    totalHours: 24,
    effectiveHourly: 130,        // ~19% off
    totalPrice: 3120,
    discountPct: 19,
    summary: "Two sessions a week for twelve weeks. The full prep arc.",
  },
];

/** Compute the price of a single ad-hoc session. */
export function singleSessionPrice(durationMinutes: number): number {
  return Math.round((HOURLY_RATE / 60) * durationMinutes);
}
