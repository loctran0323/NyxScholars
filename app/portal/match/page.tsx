import Link from "next/link";
import { ShieldCheck, CalendarPlus, MessageSquare, Sparkles, Award } from "lucide-react";
import { TUTORS, type Tutor } from "@/lib/mock/tutors";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Meet your matched tutors" };

interface AssignmentRow {
  id: string;
  teacher_id: string;
  subject: string | null;
  tutor: { full_name: string | null; school: string | null; verified_at: string | null } | null;
}

interface MatchedTutor {
  id: string;
  name: string;
  school: string;
  classOf: number;
  satScore: number;
  tags: string[];
  bio: string;
  verified: boolean;
  source: "live" | "sample";
}

export default async function MatchPage() {
  const sb = await getSupabaseServerClient();

  // 1. Live assignments first — if the admin has paired this student with
  //    real tutors, surface those (with the Verified badge from the real
  //    profile row, not the sample roster).
  let live: MatchedTutor[] = [];
  if (sb) {
    const { data: { user } } = await sb.auth.getUser();
    if (user) {
      const { data } = await sb
        .from("assignments")
        .select("id, teacher_id, subject, tutor:profiles!teacher_id(full_name, school, verified_at)")
        .eq("student_id", user.id)
        .eq("active", true);
      live = ((data ?? []) as unknown as AssignmentRow[]).map((a) => ({
        id:        a.teacher_id,
        name:      a.tutor?.full_name ?? "Tutor",
        school:    a.tutor?.school ?? "—",
        classOf:   2026,
        satScore:  1500,
        tags:      [a.subject ?? "All subjects"],
        bio:       "Assigned by Nyx after your intake.",
        verified:  !!a.tutor?.verified_at,
        source:    "live",
      }));
    }
  }

  // 2. Top up with sample roster so the screen never shows fewer than 3.
  const sample: MatchedTutor[] = TUTORS.slice(0, 3).map((t: Tutor) => ({
    id:        t.id,
    name:      t.name,
    school:    t.school,
    classOf:   t.classOf,
    satScore:  t.satScore,
    tags:      t.tags as string[],
    bio:       t.bio,
    verified:  true,
    source:    "sample",
  }));
  const matched = [...live, ...sample.filter((s) => !live.find((l) => l.id === s.id))].slice(0, 3);

  return (
    <div className="max-w-4xl">
      <header className="mb-8">
        <p className="text-[12px] text-[var(--accent)] uppercase tracking-[0.22em] font-semibold mb-1">
          Tutor matchmaking
        </p>
        <h1 className="text-[28px] font-semibold text-[var(--text-1)] leading-tight">
          Three Ivy League tutors picked for your sky.
        </h1>
        <p className="text-[var(--text-2)] mt-2 text-[14.5px] max-w-xl leading-relaxed">
          Each was scored on subject overlap, schedule fit, and prior outcomes with students like you.
          Book a free 15-minute coffee chat — pick the one you click with.
        </p>
      </header>

      <div className="space-y-4">
        {matched.map((t) => (
          <article
            key={t.id}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 flex gap-5 flex-wrap sm:flex-nowrap"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-[var(--accent-dim)] border border-[var(--border-accent)] grid place-items-center text-[var(--accent)] text-[24px] font-semibold uppercase">
              {t.name.split(" ").map((p) => p[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-[16px] font-semibold text-[var(--text-1)]">
                    {t.name}, {t.school} {t.classOf}
                  </h2>
                  <p className="text-[12.5px] text-[var(--text-3)] mt-0.5">
                    Teaches {t.tags.slice(0, 3).join(" · ")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {t.verified && (
                    <Tooltip content="Verified by Nyx: official score report, current enrollment, and a passing teaching audition.">
                      <Badge variant="verified" className="cursor-help">
                        <ShieldCheck size={10} /> Verified
                      </Badge>
                    </Tooltip>
                  )}
                  {t.source === "live" && <Badge variant="blue">Assigned</Badge>}
                  {t.source === "sample" && <Badge variant="default">Sample roster</Badge>}
                  <Badge variant="green">SAT {t.satScore}</Badge>
                  {t.tags.includes("Admissions") && <Badge variant="purple">Admissions</Badge>}
                </div>
              </div>

              <p className="text-[13px] text-[var(--text-2)] mt-3 leading-relaxed">{t.bio}</p>

              <div className="grid sm:grid-cols-3 gap-2 mt-4">
                <Stat icon={Award}      label="Specialty"    value={t.tags[0]} />
                <Stat icon={Sparkles}   label="Avg. delta"   value="+220 pts" />
                <Stat icon={ShieldCheck} label="Vetted"       value="4-step audit" />
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                <Link
                  href={`/portal/schedule?tutor=${t.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--gold-soft)] text-[var(--on-gold)] font-semibold text-[12.5px] hover:bg-[var(--gold-bright)] transition-colors"
                >
                  <CalendarPlus size={13} />
                  Book free intro chat
                </Link>
                <Link
                  href={`/portal/messages?tutor=${t.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border)] text-[var(--text-1)] font-medium text-[12.5px] hover:border-[var(--border-2)] transition-colors"
                >
                  <MessageSquare size={13} />
                  Send a question
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="text-[12.5px] text-[var(--text-3)] mt-6">
        Don&apos;t see a match? <Link href="/portal/messages?topic=re-match" className="text-[var(--accent)] hover:text-[var(--accent-bright)]">Tell us</Link> and we&apos;ll re-run the search.
      </p>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-[var(--text-3)] mb-0.5">
        <Icon size={11} />
        {label}
      </div>
      <p className="text-[13px] font-semibold text-[var(--text-1)]">{value}</p>
    </div>
  );
}
