/**
 * Stripe configuration and pricing map.
 *
 * The actual Stripe SDK call is intentionally not imported yet — once you
 * install `stripe` (`npm i stripe`) and add `STRIPE_SECRET_KEY` to your env,
 * `createCheckoutSession` below will create real Checkout Sessions.
 *
 * Until then, the API route (`/api/checkout`) returns a mock URL so the rest
 * of the payment flow can be developed end-to-end.
 */

import type { PlanType } from "@/types/portal";

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
    secretKey: process.env.STRIPE_SECRET_KEY ?? null,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? null,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    prices: {
      session: process.env.STRIPE_PRICE_SESSION ?? null,
      monthly: process.env.STRIPE_PRICE_MONTHLY ?? null,
      counseling: process.env.STRIPE_PRICE_COUNSELING ?? null,
    },
  };
}

export function isStripeConfigured(): boolean {
  const c = getStripeConfig();
  return Boolean(c.secretKey);
}
