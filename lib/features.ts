/**
 * Production feature gating.
 *
 * A tab/feature is shown only when it has real, finished content. Where content is
 * not ready yet (e.g. video lessons that have no published videos), the feature is
 * hidden in production so the deployed site has no rough edges — but stays visible
 * in development/preview so the team can keep building it.
 *
 * Override any feature explicitly with NEXT_PUBLIC_FEATURE_<NAME>=true|false. These
 * are NEXT_PUBLIC_ so the same value is available to client and server components.
 */
function flag(value: string | undefined, productionDefault: boolean): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  // Unset: enabled everywhere except production; in production use the default.
  return process.env.NODE_ENV === "production" ? productionDefault : true;
}

export const FEATURES = {
  /**
   * Video lessons. The catalog has entries but no published videos yet, so the
   * tab is a "coming soon" shell — hidden in production until real videos land.
   */
  lessons: flag(process.env.NEXT_PUBLIC_FEATURE_LESSONS, false),
} as const;

export type FeatureKey = keyof typeof FEATURES;
