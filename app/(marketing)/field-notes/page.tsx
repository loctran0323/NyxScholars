import Link from "next/link";
import { Section, Heading, Text, Eyebrow } from "@/components/system";
import { ArrowRight } from "lucide-react";
import { FIELD_NOTES } from "./content";
import { format } from "date-fns";

export const metadata = {
  title: "Field notes",
  description: "Tactics, post-mortems, and study notes from Nyx tutors.",
};

export default function FieldNotesPage() {
  return (
    <Section>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Eyebrow>Tutor-written</Eyebrow>
        <Heading as="h1" size="display">
          Field notes.
        </Heading>
        <Text muted className="mt-3">
          What our tutors learned this week, written by them. Tactics, post-mortems, and the occasional opinion.
        </Text>
      </div>
      <div className="space-y-4 max-w-3xl mx-auto">
        {FIELD_NOTES.map((n) => (
          <Link
            key={n.slug}
            href={`/field-notes/${n.slug}`}
            className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--border-2)] transition-colors"
          >
            <p className="text-[11.5px] uppercase tracking-[0.22em] text-[var(--accent)] font-semibold">
              {format(new Date(n.publishedAt), "MMM d, yyyy")} · {n.author}
            </p>
            <h2 className="text-[20px] font-semibold text-[var(--text-1)] mt-2">{n.title}</h2>
            <p className="text-[13.5px] text-[var(--text-2)] mt-2 leading-relaxed">{n.preview}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-[var(--accent)] font-semibold">
              Read note <ArrowRight size={13} />
            </p>
          </Link>
        ))}
      </div>
    </Section>
  );
}
