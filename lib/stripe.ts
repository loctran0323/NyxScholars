import Stripe from "stripe";
import type { PlanType } from "@/types/portal";

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// Map pricing.ts IDs → Stripe Price IDs (fill after creating products in Stripe dashboard)
export const PRICE_IDS: Record<string, string> = {
  "pay-as-you-go": process.env.STRIPE_PRICE_PAYG        ?? "",
  "month":         process.env.STRIPE_PRICE_MONTH       ?? "",
  "two-month":     process.env.STRIPE_PRICE_TWO_MONTH   ?? "",
  "three-month":   process.env.STRIPE_PRICE_THREE_MONTH ?? "",
  "admissions":    process.env.STRIPE_PRICE_ADMISSIONS  ?? "",
};

// Portal plan price IDs (used by upgrade flow)
export const PLAN_PRICE_IDS: Record<PlanType, string | null> = {
  session:    process.env.STRIPE_PRICE_SESSION    ?? null,
  monthly:    process.env.STRIPE_PRICE_MONTHLY    ?? null,
  counseling: process.env.STRIPE_PRICE_COUNSELING ?? null,
};

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
