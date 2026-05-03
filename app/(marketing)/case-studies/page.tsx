import Link from "next/link";
import { Section, Heading, Text, Eyebrow } from "@/components/system";
import { ArrowRight } from "lucide-react";
import { CASE_STUDIES } from "./content";

export const metadata = {
  title: "Case studies",
  description: "Long-form stories of Nyx students — score deltas, study plans, and tutor quotes.",
};

export default function CaseStudiesPage() {
  return (
    <Section>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Eyebrow>Field-proven</Eyebrow>
        <Heading as="h1" size="display">
          Case studies.
        </Heading>
        <Text muted className="mt-3">
          Three students, ninety days each. The full plan, the chart, the tutor&apos;s notes — and the test score we landed on.
        </Text>
      </div>
      <div className="space-y-5 max-w-3xl mx-auto">
        {CASE_STUDIES.map((c) => (
          <Link
            key={c.slug}
            href={`/case-studies/${c.slug}`}
            className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--border-2)] transition-colors"
          >
            <p className="text-[12px] uppercase tracking-[0.22em] font-semibold text-[var(--accent)] mb-2">
              {c.duration} · {c.subject}
            </p>
            <h2 className="text-[20px] font-semibold text-[var(--text-1)]">
              {c.studentName}: {c.delta.from} → {c.delta.to}
            </h2>
            <p className="text-[13.5px] text-[var(--text-2)] mt-2 leading-relaxed">{c.preview}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-[var(--accent)] font-semibold">
              Read story <ArrowRight size={13} />
            </p>
          </Link>
        ))}
      </div>
    </Section>
  );
}
