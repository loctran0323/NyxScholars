"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import type { PlanType } from "@/types/portal";

const PLAN_LABEL: Record<PlanType, string> = {
  session: "Session Plan",
  monthly: "Scholar Plan",
  counseling: "Admissions Plan",
};

export default function UpgradeSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = (searchParams.get("plan") as PlanType | null) ?? null;
  const isMock = searchParams.get("mock") === "1";

  const [activating, setActivating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!plan) {
      setActivating(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/portal/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan, plan_status: "active" }),
        });
        if (cancelled) return;
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Activation failed");
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Network error");
      } finally {
        if (!cancelled) setActivating(false);
      }
    })();
    return () => { cancelled = true; };
  }, [plan]);

  return (
    <div className="max-w-md mx-auto py-12 text-center">
      <div className="w-14 h-14 rounded-full mx-auto mb-5 grid place-items-center bg-[var(--accent-dim)] border border-[var(--border-accent)]">
        <CheckCircle2 size={22} className="text-[var(--accent)]" />
      </div>

      <h1 className="text-[26px] font-bold text-[var(--text-1)] mb-2">
        {activating ? "Activating your plan…" : "You're in."}
      </h1>

      <p className="text-[var(--text-2)] text-[14px] leading-relaxed mb-6">
        {plan ? `Your ${PLAN_LABEL[plan]} is ${activating ? "being activated" : "active"}.` : "Plan unknown."}
        {isMock && " (Stripe is in mock mode — no real payment was charged.)"}
      </p>

      {error && (
        <p className="text-[13px] text-red-400 mb-4">{error}</p>
      )}

      <div className="flex flex-col gap-3">
        <button
          onClick={() => router.push("/portal")}
          disabled={activating}
          className="w-full py-3 rounded-xl bg-[#0c1124] border border-[var(--accent)]/45 text-[var(--text-1)] font-semibold hover:bg-[#141a30] hover:border-[var(--accent)] transition-all disabled:opacity-60"
        >
          Go to your dashboard
        </button>
        <Link
          href="/portal/schedule"
          className="text-[13px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
        >
          Or schedule your first session →
        </Link>
      </div>
    </div>
  );
}
