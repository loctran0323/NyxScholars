import Link from "next/link";
import { Section, Heading, Text, Eyebrow } from "@/components/system";
import { ShieldCheck, GraduationCap, Sparkles, Heart, FileSearch } from "lucide-react";

export const metadata = {
  title: "Tutor handbook",
  description: "How Nyx tutors work — vetting, training, code of conduct, and revenue share.",
};

const SECTIONS = [
  {
    icon: ShieldCheck,
    title: "Four-step vetting",
    body: `Every Nyx tutor passes: (1) verified score report (≥1500 SAT or ≥34 ACT), (2) current Ivy League / equivalent enrollment confirmed via .edu, (3) a 45-minute teaching audition with a Nyx senior tutor, (4) a 14-day trial cohort review with two students before they go onto the public roster.`,
  },
  {
    icon: GraduationCap,
    title: "Training",
    body: `New tutors complete the Nyx training arc — 8 hours on adaptive teaching, 4 hours on accommodations (dyslexia, ADHD, ELL), and 6 hours of shadowed sessions with a senior tutor before they take their first solo session.`,
  },
  {
    icon: FileSearch,
    title: "Background checks &amp; NDA",
    body: `All tutors complete a Checkr background check before working with under-18 students. NDA + code-of-conduct signing happens at onboarding via DocuSign.`,
  },
  {
    icon: Sparkles,
    title: "Continuing education",
    body: `Quarterly internal workshops on test changes, AI tooling, and pedagogy. Attendance contributes to the bonus pool.`,
  },
  {
    icon: Heart,
    title: "Revenue share &amp; payouts",
    body: `Tutors keep 75% of the session rate. Payouts are issued via Stripe Connect Express within 24 hours of session completion. Transparent. Non-negotiable. No tier-down for new tutors.`,
  },
];

export default function HandbookPage() {
  return (
    <Section>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Eyebrow>Internal · public</Eyebrow>
        <Heading as="h1" size="display">
          Tutor handbook.
        </Heading>
        <Text muted className="mt-3">
          The same document that lives inside Nyx for our tutors. Published here because we believe
          parents should see how the people teaching their kids are vetted, trained, and paid.
        </Text>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <article key={s.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--accent-dim)] border border-[var(--border-accent)] grid place-items-center">
                  <Icon size={15} className="text-[var(--accent)]" />
                </div>
                <h2 className="text-[16px] font-semibold text-[var(--text-1)]" dangerouslySetInnerHTML={{ __html: s.title }} />
              </div>
              <p className="text-[14px] text-[var(--text-2)] leading-relaxed" dangerouslySetInnerHTML={{ __html: s.body }} />
            </article>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <Link
          href="/apply"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--gold-soft)] text-[var(--on-gold)] font-semibold text-[14px] hover:bg-[var(--gold-bright)] transition-colors"
        >
          Apply to teach with Nyx
        </Link>
      </div>
    </Section>
  );
}
