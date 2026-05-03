/**
 * Shared Zod schemas. Mirror tables in lib/database.types.ts so API routes
 * can validate inputs before they reach Supabase. Anything written by the
 * client should pass through one of these.
 */

import { z } from "zod";

export const ProfileUpdate = z.object({
  full_name:    z.string().trim().max(120).nullable().optional(),
  grade:        z.string().trim().max(40).nullable().optional(),
  school:       z.string().trim().max(120).nullable().optional(),
  phone:        z.string().trim().max(40).nullable().optional(),
  target_test:  z.enum(["SAT", "ACT"]).nullable().optional(),
  target_score: z.string().trim().max(10).nullable().optional(),
  timezone:     z.string().trim().max(60).nullable().optional(),
  locale:       z.string().trim().max(20).nullable().optional(),
  parent_name:  z.string().trim().max(120).nullable().optional(),
  parent_email: z.string().email().nullable().optional(),
  notif_prefs:  z.record(z.string(), z.any()).optional(),
});
export type ProfileUpdateInput = z.infer<typeof ProfileUpdate>;

export const SessionRequest = z.object({
  subject:           z.string().trim().min(1).max(80),
  scheduled_at:      z.string().datetime(),
  duration_minutes:  z.number().int().min(15).max(240).default(60),
  student_notes:     z.string().trim().max(2000).optional(),
});
export type SessionRequestInput = z.infer<typeof SessionRequest>;

export const SessionPatch = z.object({
  scheduled_at:      z.string().datetime().optional(),
  status:            z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
  duration_minutes:  z.number().int().min(15).max(240).optional(),
  student_notes:     z.string().trim().max(2000).optional(),
}).refine((v) => Object.keys(v).length > 0, { message: "Empty patch" });
export type SessionPatchInput = z.infer<typeof SessionPatch>;

export const MessageCreate = z.object({
  content: z.string().trim().min(1).max(4000),
});
export type MessageCreateInput = z.infer<typeof MessageCreate>;

export const LeadCreate = z.object({
  student_name:        z.string().trim().min(2).max(120),
  parent_name:         z.string().trim().max(120).optional(),
  email:               z.string().email().max(160),
  phone:               z.string().trim().max(40).optional(),
  grade:               z.string().trim().min(1).max(40),
  service:             z.string().trim().min(1).max(80),
  ap_subject:          z.string().trim().max(80).optional(),
  current_score:       z.string().trim().max(10).optional(),
  target_score:        z.string().trim().max(10).optional(),
  test_date:           z.string().trim().max(40).optional(),
  tutoring_format:     z.string().trim().min(1).max(80),
  availability_notes:  z.string().trim().max(1000).optional(),
  help_needed:         z.string().trim().max(2000).optional(),
  consent:             z.boolean().refine((v) => v === true, { message: "Consent required" }),
});
export type LeadCreateInput = z.infer<typeof LeadCreate>;

export const CheckoutRequest = z.object({
  plan:        z.enum(["session", "monthly", "counseling"]).optional(),
  packageId:   z.string().trim().max(40).optional(),
  /** Annual prepay toggle — applies the +6% discount when true. */
  annualPrepay: z.boolean().optional(),
  /** Optional gift card code applied at checkout. */
  promoCode:   z.string().trim().max(40).optional(),
}).refine((v) => v.plan || v.packageId, { message: "plan or packageId required" });
export type CheckoutRequestInput = z.infer<typeof CheckoutRequest>;

export const NpsSubmit = z.object({
  score:  z.number().int().min(0).max(10),
  reason: z.string().trim().max(2000).optional(),
});
export type NpsSubmitInput = z.infer<typeof NpsSubmit>;

export const OnboardingPatch = z.object({
  step:     z.string().trim().max(40),
  done:     z.boolean(),
  context:  z.record(z.string(), z.any()).optional(),
});
export type OnboardingPatchInput = z.infer<typeof OnboardingPatch>;

export const GiftCardPurchase = z.object({
  amountCents:    z.number().int().min(2500).max(500_00 * 100),
  recipientName:  z.string().trim().min(1).max(120),
  recipientEmail: z.string().email().max(160),
  senderName:     z.string().trim().min(1).max(120),
  message:        z.string().trim().max(500).optional(),
  deliverAt:      z.string().datetime().optional(),
});
export type GiftCardPurchaseInput = z.infer<typeof GiftCardPurchase>;

/**
 * Wrap any zod schema for safer parsing in API routes — never throws.
 */
export function safeParseJson<T>(schema: z.ZodSchema<T>, body: unknown):
  | { ok: true; data: T }
  | { ok: false; error: string; details?: unknown } {
  const result = schema.safeParse(body);
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, error: "Invalid request body", details: result.error.issues };
}
