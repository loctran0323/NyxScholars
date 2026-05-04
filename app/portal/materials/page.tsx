"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PortalHero } from "@/components/portal/PortalHero";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { Profile, PlanType } from "@/types/portal";
import {
  MATERIALS,
  type MaterialCategory,
  type MaterialDifficulty,
} from "./content";

function getAllowedCategories(plan: PlanType | null, planSubject: string | null, addons: string[] | null): MaterialCategory[] {
  const hasCounseling = plan === "counseling" || addons?.includes("counseling");

  if (plan === "session") {
    switch (planSubject) {
      case "SAT":               return ["SAT", "Strategy"];
      case "ACT":               return ["ACT", "Strategy"];
      case "AP":                return ["AP", "Strategy"];
      case "College Admissions":return ["College Admissions"];
      default:                  return ["SAT", "ACT", "AP", "Strategy"];
    }
  }
  if (plan === "monthly") {
    const cats: MaterialCategory[] = ["SAT", "ACT", "AP", "Strategy"];
    if (hasCounseling) cats.push("College Admissions");
    return cats;
  }
  if (plan === "counseling") {
    return ["College Admissions", "SAT", "ACT", "AP", "Strategy"];
  }
  return ["SAT", "ACT", "AP", "Strategy"];
}

const DIFFICULTIES: ("All" | MaterialDifficulty)[] = ["All", "Beginner", "Intermediate", "Advanced"];

const difficultyVariant = (d: MaterialDifficulty): "green" | "gold" | "red" =>
  d === "Beginner" ? "green" : d === "Advanced" ? "red" : "gold";

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn(
      "px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-all whitespace-nowrap",
      active ? "bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--border-accent)]" : "bg-white/[0.04] text-[var(--text-2)] border border-[var(--border)] hover:border-[var(--border-2)] hover:text-[var(--text-1)]"
    )}>
      {label}
    </button>
  );
}

const SESSION_ACCESS_DAYS = 7;

export default function MaterialsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lastSessionAt, setLastSessionAt] = useState<string | null | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<"All" | MaterialCategory>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | MaterialDifficulty>("All");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    void supabase.auth.getUser().then(async (authRes: { data: { user: { id: string } | null } }) => {
      const user = authRes.data.user;
      if (!user) return;

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (profileData) setProfile(profileData as Profile);

      if (profileData?.plan === "session") {
        const { data: sessions } = await supabase
          .from("sessions")
          .select("scheduled_at")
          .eq("student_id", user.id)
          .in("status", ["confirmed", "completed"])
          .order("scheduled_at", { ascending: false })
          .limit(1);
        setLastSessionAt(sessions?.[0]?.scheduled_at ?? null);
      } else {
        setLastSessionAt(null);
      }
    });
  }, []);

  const isSessionPlan = profile?.plan === "session";
  const accessExpired = (() => {
    if (!isSessionPlan) return false;
    if (lastSessionAt === undefined) return false;
    if (!lastSessionAt) return true;
    const daysSince = (Date.now() - new Date(lastSessionAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince > SESSION_ACCESS_DAYS;
  })();

  const allowedCats = getAllowedCategories(profile?.plan ?? null, profile?.plan_subject ?? null, profile?.plan_addons ?? null);
  const visibleMaterials = MATERIALS.filter((m) => allowedCats.includes(m.category));

  const filtered = visibleMaterials.filter((m) => {
    const matchCat  = categoryFilter === "All" || m.category === categoryFilter;
    const matchDiff = difficultyFilter === "All" || m.difficulty === difficultyFilter;
    return matchCat && matchDiff;
  });

  const availableCats: ("All" | MaterialCategory)[] = ["All", ...allowedCats.filter((c, i, a) => a.indexOf(c) === i)];

  return (
    <div>
      <PortalHero
        eyebrow="Library"
        title="Field guides,"
        italic="written in-house"
        subtitle="Short, sharp study notes from the Nyx tutors. Each one is a single concept worth ten minutes of your time."
      />

      {accessExpired && (
        <div className="rounded-2xl border border-white/[0.08] bg-[var(--surface)] p-8 text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={22} className="text-[var(--accent)]" />
          </div>
          <h2 className="text-[17px] font-bold text-[var(--text-1)] mb-2">Library access expired</h2>
          <p className="text-[var(--text-2)] text-[13.5px] leading-relaxed max-w-sm mx-auto mb-6">
            Session-plan members get {SESSION_ACCESS_DAYS} days of library access after each session.
            Book another session to unlock access again.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/portal/schedule"
              className="px-5 py-2.5 rounded-xl bg-[#0c1124] border border-[var(--accent)]/45 text-[var(--text-1)] font-semibold text-[13px] hover:bg-[#141a30] hover:border-[var(--accent)] transition-all"
            >
              Book a session
            </Link>
            <Link
              href="/portal/upgrade"
              className="px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[var(--text-1)] font-medium text-[13px] hover:border-white/[0.18] transition-all"
            >
              Upgrade to Monthly
            </Link>
          </div>
        </div>
      )}

      <div className={accessExpired ? "opacity-30 pointer-events-none select-none blur-[2px]" : ""}>
        <div className="space-y-3 mb-6">
          <div>
            <p className="text-[11px] text-[var(--text-3)] font-semibold uppercase tracking-wider mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {availableCats.map((c) => (
                <FilterChip key={c} label={c} active={categoryFilter === c} onClick={() => setCategoryFilter(c)} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] text-[var(--text-3)] font-semibold uppercase tracking-wider mb-2">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((d) => (
                <FilterChip key={d} label={d} active={difficultyFilter === d} onClick={() => setDifficultyFilter(d)} />
              ))}
            </div>
          </div>
        </div>

        <p className="text-[12px] text-[var(--text-3)] mb-4">{filtered.length} guide{filtered.length !== 1 ? "s" : ""}</p>

        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((material) => (
            <Link
              key={material.slug}
              href={`/portal/materials/${material.slug}`}
              className="group flex gap-4 p-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl hover:border-[var(--border-2)] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--text-2)] group-hover:text-[var(--accent)] transition-colors">
                <BookOpen size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)] mb-1">{material.category}</p>
                <p className="text-[13.5px] font-semibold text-[var(--text-1)] leading-snug mb-1.5 line-clamp-2">{material.title}</p>
                <p className="text-[12px] text-[var(--text-2)] line-clamp-2 leading-relaxed mb-3">{material.blurb}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={difficultyVariant(material.difficulty)} size="sm">{material.difficulty}</Badge>
                  <span className="text-[11px] text-[var(--text-3)] inline-flex items-center gap-1">
                    <Clock size={10} /> {material.readingTime}
                  </span>
                  <span className="text-[11px] text-[var(--text-3)] truncate">· {material.author}</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-[var(--text-3)] shrink-0 self-center group-hover:text-[var(--accent)] transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
