import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Quote } from "lucide-react";
import { CASE_STUDIES } from "../content";
import { Section, Heading, Text } from "@/components/system";
import { Badge } from "@/components/ui/badge";

interface RouteParams { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: RouteParams) {
  const { slug } = await params;
  const c = CASE_STUDIES.find((x) => x.slug === slug);
  if (!c) return {};
  return {
    title: `${c.studentName}: ${c.delta.from} → ${c.delta.to}`,
    description: c.preview,
  };
}

export default async function Page({ params }: RouteParams) {
  const { slug } = await params;
  const c = CASE_STUDIES.find((x) => x.slug === slug);
  if (!c) notFound();
  return (
    <Section>
      <article className="max-w-3xl mx-auto">
        <Link href="/case-studies" className="text-[12px] text-[var(--text-3)] hover:text-[var(--text-1)] uppercase tracking-[0.2em] font-mono">
          ← all case studies
        </Link>
        <header className="mt-4 mb-8">
          <p className="text-[12px] uppercase tracking-[0.22em] font-semibold text-[var(--accent)]">{c.hero.eyebrow}</p>
          <Heading as="h1" size="display" className="mt-1">
            {c.hero.title}
          </Heading>
          <Text muted className="mt-3">{c.hero.subtitle}</Text>
        </header>

        <div className="rounded-2xl border border-[var(--border-accent)] bg-[var(--accent-dim)] p-6 mb-8 grid sm:grid-cols-3 gap-3 text-center">
          <Stat label="Score lift" value={`+${c.delta.to - c.delta.from}`} sub={`${c.delta.from} → ${c.delta.to}`} />
          <Stat label="Subject"    value={c.subject} />
          <Stat label="Duration"   value={c.duration} />
        </div>

        <h2 className="text-[20px] font-semibold text-[var(--text-1)] mb-4">Week-by-week</h2>
        <ol className="relative border-l border-[var(--border)] ml-3 mb-10">
          {c.timeline.map((row) => (
            <li key={`${row.week}-${row.milestone}`} className="ml-6 mb-6">
              <span className="absolute -left-1.5 w-3 h-3 rounded-full bg-[var(--accent)] border-2 border-[var(--bg)]" />
              <Badge variant="default" className="mb-2">Week {row.week}</Badge>
              <p className="text-[14.5px] text-[var(--text-1)] font-semibold">{row.milestone}</p>
              <p className="text-[13px] text-[var(--text-2)] leading-relaxed mt-0.5">{row.detail}</p>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 mb-10">
          <Quote size={20} className="text-[var(--accent)] opacity-50 mb-2" />
          <p className="text-[15px] text-[var(--text-1)] leading-relaxed italic">"{c.tutorQuote.text}"</p>
          <p className="text-[12.5px] text-[var(--text-3)] mt-3">
            — {c.tutorQuote.name}, {c.tutorQuote.school}
          </p>
        </div>

        <Link
          href="/portal/signup"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--gold-soft)] text-[var(--on-gold)] font-semibold text-[14px] hover:bg-[var(--gold-bright)] transition-colors"
        >
          Start your own arc <ArrowRight size={14} />
        </Link>
      </article>
    </Section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p className="text-[10.5px] text-[var(--text-3)] uppercase tracking-wider">{label}</p>
      <p className="text-[24px] font-semibold text-[var(--text-1)] mt-1">{value}</p>
      {sub && <p className="text-[11.5px] text-[var(--text-3)] mt-0.5">{sub}</p>}
    </div>
  );
}
