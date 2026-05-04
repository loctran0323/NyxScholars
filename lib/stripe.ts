import Stripe from "stripe";
import type { PlanType } from "@/types/portal";

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// Map pricing.ts package IDs → Stripe Price IDs
export const PRICE_IDS: Record<string, string> = {
  "pay-as-you-go": process.env.STRIPE_PRICE_PAY      ?? "",
  "month":         process.env.STRIPE_FOUR_PAY        ?? "",
  "two-month":     process.env.STRIPE_EIGHT_PAY       ?? "",
  "three-month":   process.env.STRIPE_TWELVE_PAY      ?? "",
  "admissions":    process.env.STRIPE_PAY_ADMISSIONS  ?? "",
};

// Portal plan price IDs (used by upgrade flow)
export const PLAN_PRICE_IDS: Record<PlanType, string | null> = {
  session:    process.env.STRIPE_PRICE_PAY      ?? null,
  monthly:    process.env.STRIPE_EIGHT_PAY       ?? null,
  counseling: process.env.STRIPE_PAY_ADMISSIONS ?? null,
};

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export interface StripeConfig {
  publishableKey: string | null;
  secretKey: string | null;
  webhookSecret: string | null;
  siteUrl: string;
  prices: Record<PlanType, string | null>;
}

export function getStripeConfig(): StripeConfig {
  return {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null,
    secretKey:      process.env.STRIPE_SECRET_KEY                  ?? null,
    webhookSecret:  process.env.STRIPE_WEBHOOK_SECRET              ?? null,
    siteUrl:        process.env.NEXT_PUBLIC_SITE_URL               ?? "https://nyxscholars.com/",
    prices: {
      session:    process.env.STRIPE_PRICE_PAY      ?? null,
      monthly:    process.env.STRIPE_FOUR_PAY       ?? null,
      counseling: process.env.STRIPE_PAY_ADMISSIONS ?? null,
    },
  };
}
