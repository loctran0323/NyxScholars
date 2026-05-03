"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { ONBOARDING_STEPS, isOnboardingStepDone, onboardingProgress, type OnboardingStepId } from "@/lib/onboarding";
import type { Profile } from "@/types/portal";
import { cn } from "@/lib/utils";

export function OnboardingChecklist({ profile }: { profile: Profile | null }) {
  const progress = onboardingProgress(profile);
  if (progress.pct === 100) return null;

  return (
    <section className="rounded-2xl border border-[var(--border-accent)] bg-[var(--accent-dim)] p-5">
      <header className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[var(--accent)]">Get fully set up</p>
          <p className="text-[15px] font-semibold text-[var(--text-1)] mt-0.5">
            {progress.done}/{progress.total} done — {progress.pct}%
          </p>
        </div>
        <div className="w-24 h-1.5 rounded-full bg-[var(--bg-2)] overflow-hidden" aria-label="onboarding progress">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
      </header>
      <ul className="space-y-1.5">
        {ONBOARDING_STEPS.map((step) => {
          const done = isOnboardingStepDone(profile, step.id as OnboardingStepId);
          return (
            <li key={step.id}>
              <Link
                href={step.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors",
                  done
                    ? "border-transparent text-[var(--text-3)]"
                    : "border-[var(--border)] hover:border-[var(--border-2)] bg-[var(--surface)]/40 hover:bg-[var(--surface)]",
                )}
              >
                {done ? (
                  <CheckCircle2 size={15} className="text-[var(--success)] shrink-0" />
                ) : (
                  <Circle size={15} className="text-[var(--text-3)] shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className={cn("text-[13px] font-semibold truncate", done ? "text-[var(--text-3)] line-through" : "text-[var(--text-1)]")}>
                    {step.label}
                  </p>
                  {!done && <p className="text-[11.5px] text-[var(--text-2)] truncate">{step.description}</p>}
                </div>
                {!done && <ChevronRight size={13} className="text-[var(--text-3)]" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
