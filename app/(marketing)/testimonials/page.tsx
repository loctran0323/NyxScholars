import Link from "next/link";
import { Section, Heading, Text, Eyebrow } from "@/components/system";
import { Badge } from "@/components/ui/badge";
import { Quote, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Testimonials",
  description: "Score deltas, parent reviews, and quotes from Nyx Scholars students.",
};

interface Testimonial {
  id: string;
  studentName: string;
  parentName?: string;
  school: string;
  delta?: { from: number; to: number; label: string };
  quote: string;
  tutor: string;
  consentLevel: "named" | "first-name" | "anonymous";
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "maya-1180-1520",
    studentName: "Maya C.",
    school: "Phillips Exeter",
    delta: { from: 1180, to: 1520, label: "SAT" },
    quote: "I went from feeling like I was studying in the dark to actually understanding why I was missing the questions I missed. My tutor met me twice a week for 90 days and we hit 1520 on test day.",
    tutor: "Princeton '26",
    consentLevel: "first-name",
  },
  {
    id: "ahmed-act",
    studentName: "Ahmed R.",
    parentName: "Sara R., parent",
    school: "Berkeley High",
    delta: { from: 26, to: 33, label: "ACT" },
    quote: "We tried two big-name companies first. Nyx was the first place where my tutor actually adapted to how Ahmed thinks. Worth every dollar.",
    tutor: "Yale '25",
    consentLevel: "first-name",
  },
  {
    id: "ap-bio",
    studentName: "Anonymous",
    school: "Stuyvesant",
    quote: "I went from a 3 to a 5 on AP Bio in twelve weeks. The spaced-repetition deck after each session was the unlock.",
    tutor: "Harvard '26",
    consentLevel: "anonymous",
  },
  {
    id: "early-decision",
    studentName: "Priya M.",
    school: "Sidwell Friends",
    quote: "I got into Stanford early decision. My Nyx counselor sat with me through every essay round. They didn't write a single sentence — they made me write better.",
    tutor: "Stanford '24",
    consentLevel: "first-name",
  },
];

export default function TestimonialsPage() {
  return (
    <div>
      <Section>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Eyebrow>From real families</Eyebrow>
          <Heading as="h1" size="display">
            Score deltas, in their own words.
          </Heading>
          <Text muted className="mt-3">
            Each testimonial below is published with explicit parent consent. Where a name is shortened, that's how the family asked us to credit them.
          </Text>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                {t.delta ? (
                  <Badge variant="gold">
                    {t.delta.label} {t.delta.from} → {t.delta.to}{" "}
                    <span className="ml-1 normal-case font-normal opacity-75">+{t.delta.to - t.delta.from}</span>
                  </Badge>
                ) : (
                  <Badge variant="default">{t.school}</Badge>
                )}
                <Badge variant="default" className="text-[var(--text-3)]">
                  Tutor: {t.tutor}
                </Badge>
              </div>
              <Quote size={20} className="text-[var(--accent)] opacity-40 mb-2" />
              <p className="text-[var(--text-1)] text-[15px] leading-relaxed flex-1">{t.quote}</p>
              <footer className="mt-4 pt-4 border-t border-[var(--border)]">
                <p className="text-[13px] text-[var(--text-1)] font-semibold">{t.studentName}</p>
                <p className="text-[12px] text-[var(--text-3)] mt-0.5">
                  {t.school} {t.parentName && `· ${t.parentName}`}
                </p>
              </footer>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-[14px] text-[var(--accent)] hover:text-[var(--accent-bright)] font-semibold"
          >
            Read full case studies <ArrowRight size={14} />
          </Link>
        </div>
      </Section>
    </div>
  );
}
