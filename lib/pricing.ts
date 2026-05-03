/**
 * Single source of truth for Nyx pricing.
 *
 * Three product tiers:
 *   • Session   — pay-as-you-go at $160/hr
 *   • Scholar   — recurring weekly cadence at a discounted rate
 *   • Concierge — admissions counseling, custom-quoted
 *
 * On top of that, two cross-cutting modifiers:
 *   • Annual prepay — when a Scholar plan is paid 12 months upfront,
 *     apply an additional 6% discount on top of the cadence discount.
 *   • Gift cards — purchased separately, redeemed at checkout via promo
 *     codes (Stripe coupons in production).
 *
 * Defaults are defined in code so the app boots without a database.
 * Admins can override per-package fields via the `pricing_config` table
 * (see supabase-pricing-schema.sql) — `getPackages()` merges DB rows on
 * top of the defaults.
 */

import { getServiceRoleClient } from "@/lib/supabase";

export const HOURLY_RATE = 160;
export const TRIAL_MINUTES = 30;
export const ANNUAL_PREPAY_DISCOUNT_PCT = 6;
export const TUTOR_REVENUE_SHARE_PCT = 75;

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

/** Code-level defaults — used when the pricing_config table is empty. */
export const DEFAULT_PACKAGES: Package[] = [
  {
    id: "month",
    name: "Monthly Cadence",
    weeks: 4,
    hoursPerWeek: 2,
    totalHours: 8,
    effectiveHourly: 150,
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
    effectiveHourly: 140,
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
    effectiveHourly: 130,
    totalPrice: 3120,
    discountPct: 19,
    summary: "Two sessions a week for twelve weeks. The full prep arc.",
  },
];

/**
 * Backwards-compatible export — most call sites reference PACKAGES directly.
 * Prefer `getPackages()` for surfaces that should reflect admin overrides.
 */
export const PACKAGES: Package[] = DEFAULT_PACKAGES;

interface PricingConfigRow {
  id: string;
  name: string | null;
  weeks: number | null;
  hours_per_week: number | null;
  total_hours: number | null;
  total_price: number | null;
  effective_hourly: number | null;
  discount_pct: number | null;
  summary: string | null;
  recommended: boolean | null;
  enabled: boolean;
}

/**
 * Fetch the live package list — DB overrides on top of code defaults.
 * Server-side only (uses the service role client).
 */
export async function getPackages(): Promise<Package[]> {
  const sb = getServiceRoleClient();
  if (!sb) return DEFAULT_PACKAGES;
  const { data, error } = await sb
    .from("pricing_config")
    .select("*")
    .eq("enabled", true);
  if (error || !data) return DEFAULT_PACKAGES;
  const overrides = new Map<string, PricingConfigRow>(
    (data as unknown as PricingConfigRow[]).map((r) => [r.id, r]),
  );
  return DEFAULT_PACKAGES.map((p) => {
    const o = overrides.get(p.id);
    if (!o) return p;
    return {
      ...p,
      name:            o.name             ?? p.name,
      weeks:           o.weeks            ?? p.weeks,
      hoursPerWeek:    (o.hours_per_week as 2) ?? p.hoursPerWeek,
      totalHours:      o.total_hours      ?? p.totalHours,
      totalPrice:      o.total_price      ?? p.totalPrice,
      effectiveHourly: o.effective_hourly ?? p.effectiveHourly,
      discountPct:     o.discount_pct     ?? p.discountPct,
      summary:         o.summary          ?? p.summary,
      recommended:     o.recommended      ?? p.recommended,
    };
  });
}

export function getPackage(id: Package["id"]): Package | undefined {
  return PACKAGES.find((p) => p.id === id);
}

/** Compute the price of a single ad-hoc session. */
export function singleSessionPrice(durationMinutes: number): number {
  return Math.round((HOURLY_RATE / 60) * durationMinutes);
}

/**
 * Apply the annual-prepay 6% discount on top of an existing cadence price.
 * Returns the totals for both the per-cycle and the annual-equivalent.
 */
export function annualPrepayPricing(pkg: Package) {
  const cyclesPerYear = Math.floor(52 / pkg.weeks);
  const annualGross = pkg.totalPrice * cyclesPerYear;
  const annualNet = Math.round(annualGross * (1 - ANNUAL_PREPAY_DISCOUNT_PCT / 100));
  const monthlyEquivalent = Math.round(annualNet / 12);
  const effectiveHourly = Math.round(annualNet / (pkg.totalHours * cyclesPerYear));
  return {
    cyclesPerYear,
    annualGross,
    annualNet,
    monthlyEquivalent,
    effectiveHourly,
    discountPct: ANNUAL_PREPAY_DISCOUNT_PCT,
  };
}

/** Display: format a USD amount without trailing cents when whole. */
export function fmtUsd(cents: number): string {
  const dollars = cents / 100;
  return dollars % 1 === 0
    ? `$${dollars.toLocaleString()}`
    : `$${dollars.toFixed(2)}`;
}

export function fmtUsdWhole(amount: number): string {
  return `$${Math.round(amount).toLocaleString()}`;
}

/** Tutor revenue-share copy block. */
export function revenueShareCopy(): { tutorPct: number; nyxPct: number; line: string } {
  const tutorPct = TUTOR_REVENUE_SHARE_PCT;
  const nyxPct = 100 - tutorPct;
  return {
    tutorPct,
    nyxPct,
    line: `Tutors keep ${tutorPct}% of the session rate. Nyx keeps ${nyxPct}% to fund vetting, software, and concierge support.`,
  };
}

/** Gift card preset denominations (in cents). */
export const GIFT_CARD_PRESETS_CENTS: number[] = [
  100_00,
  250_00,
  500_00,
  1000_00,
  2500_00,
];
export const GIFT_CARD_MIN_CENTS = 25_00;
export const GIFT_CARD_MAX_CENTS = 5000_00;
