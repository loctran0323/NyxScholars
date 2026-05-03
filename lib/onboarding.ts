/**
 * Onboarding state machine. Steps are persisted on profile.onboarding_state
 * so they survive across devices and sessions.
 *
 *   { account_created: true, intake_intent: { ... }, target_set: true,
 *     tutor_matched: false, first_session_booked: false, first_message_sent: false }
 */

import type { Profile } from "@/types/portal";

export type OnboardingStepId =
  | "account_created"
  | "intake_complete"
  | "target_set"
  | "tutor_matched"
  | "first_session_booked"
  | "diagnostic_taken"
  | "first_message_sent";

export interface OnboardingStep {
  id: OnboardingStepId;
  label: string;
  description: string;
  href: string;
  required?: boolean;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: "account_created",       label: "Create your account",     description: "Done as soon as you signed in.",                      href: "/portal",            required: true },
  { id: "target_set",            label: "Set your target test",    description: "SAT or ACT plus your goal score, on the profile page.", href: "/portal/profile",   required: true },
  { id: "intake_complete",       label: "Complete the intake",     description: "Three-step concierge intake — about three minutes.",   href: "/portal/onboarding",  required: true },
  { id: "diagnostic_taken",      label: "Take the adaptive test",  description: "Pinpoints your strengths in roughly 14 questions.",   href: "/portal/diagnostic", required: true },
  { id: "tutor_matched",         label: "Meet your matched tutor", description: "We'll pair you with three vetted Ivy League tutors.",  href: "/portal/match",      required: false },
  { id: "first_session_booked",  label: "Book your first session", description: "Trial session is free; standard sessions billed at $160/hr.", href: "/portal/schedule", required: false },
  { id: "first_message_sent",    label: "Say hi to the team",      description: "Reach Maya, Ben, and your tutor in messages.",        href: "/portal/messages",   required: false },
];

export function isOnboardingStepDone(profile: Profile | null | undefined, stepId: OnboardingStepId): boolean {
  if (!profile) return false;
  const state = (profile as unknown as { onboarding_state?: Record<string, boolean> }).onboarding_state ?? {};
  if (stepId === "account_created") return true;
  if (stepId === "target_set")      return Boolean(profile.target_test);
  return state[stepId] === true;
}

export function onboardingProgress(profile: Profile | null | undefined): { done: number; total: number; pct: number } {
  const total = ONBOARDING_STEPS.length;
  const done  = ONBOARDING_STEPS.filter((s) => isOnboardingStepDone(profile, s.id)).length;
  return { done, total, pct: Math.round((done / total) * 100) };
}
