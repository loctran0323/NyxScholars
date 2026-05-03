import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { FIELD_NOTES } from "../content";
import { Section, Heading, Text } from "@/components/system";

interface RouteParams { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return FIELD_NOTES.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: RouteParams) {
  const { slug } = await params;
  const n = FIELD_NOTES.find((x) => x.slug === slug);
  if (!n) return {};
  return { title: n.title, description: n.preview };
}

export default async function Page({ params }: RouteParams) {
  const { slug } = await params;
  const n = FIELD_NOTES.find((x) => x.slug === slug);
  if (!n) notFound();
  return (
    <Section>
      <article className="max-w-2xl mx-auto">
        <Link href="/field-notes" className="text-[12px] text-[var(--text-3)] hover:text-[var(--text-1)] uppercase tracking-[0.2em] font-mono">
          ← all field notes
        </Link>
        <p className="mt-4 text-[12px] uppercase tracking-[0.22em] text-[var(--accent)] font-semibold">
          {format(new Date(n.publishedAt), "MMM d, yyyy")} · {n.author}
        </p>
        <Heading as="h1" size="display" className="mt-2">{n.title}</Heading>
        <div className="mt-6 space-y-4 text-[16px] leading-[1.85] text-[var(--text-1)]">
          {n.body.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <Text muted className="mt-10">
          Want to ask the author a question? <Link href="/portal/signup" className="text-[var(--accent)]">Start a Nyx trial</Link> and they&apos;re a message away.
        </Text>
      </article>
    </Section>
  );
}
