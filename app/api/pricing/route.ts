import { NextResponse } from "next/server";
import { getPackages, ANNUAL_PREPAY_DISCOUNT_PCT, HOURLY_RATE, TUTOR_REVENUE_SHARE_PCT } from "@/lib/pricing";

export const runtime = "nodejs";

/**
 * GET /api/pricing
 *
 * Returns the live package list (DB overrides on top of code defaults) so
 * /portal/upgrade and the marketing pricing page render the same numbers
 * an admin edited via /admin/pricing.
 */
export async function GET() {
  const packages = await getPackages();
  return NextResponse.json({
    hourlyRate:               HOURLY_RATE,
    annualPrepayDiscountPct:  ANNUAL_PREPAY_DISCOUNT_PCT,
    tutorRevenueSharePct:     TUTOR_REVENUE_SHARE_PCT,
    packages,
  });
}
