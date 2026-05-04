import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MATERIALS, getMaterialBySlug } from "../content";

export const metadata = { title: "Field guide · Nyx" };

export function generateStaticParams() {
  return MATERIALS.map((m) => ({ slug: m.slug }));
}

const difficultyVariant = (d: "Beginner" | "Intermediate" | "Advanced"): "green" | "gold" | "red" =>
  d === "Beginner" ? "green" : d === "Advanced" ? "red" : "gold";

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getMaterialBySlug(slug);
  if (!guide) notFound();

  const paragraphs = guide.body.split(/\n\n+/);

  return (
    <article className="max-w-2xl mx-auto">
      <Link
        href="/portal/materials"
        className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-3)] hover:text-[var(--text-1)] uppercase tracking-[0.2em] font-mono mb-6"
      >
        <ArrowLeft size={12} /> Back to library
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="default" size="sm">{guide.category}</Badge>
          <Badge variant={difficultyVariant(guide.difficulty)} size="sm">{guide.difficulty}</Badge>
          <span className="inline-flex items-center gap-1.5 text-[11.5px] text-[var(--text-3)]">
            <Clock size={11} /> {guide.readingTime}
          </span>
        </div>
        <h1 className="text-[28px] sm:text-[34px] font-light font-[family-name:var(--font-fraunces)] text-[var(--text-1)] leading-tight">
          {guide.title}
        </h1>
        <p className="text-[14px] text-[var(--text-2)] mt-3 leading-relaxed">{guide.blurb}</p>
        <p className="text-[12px] text-[var(--text-3)] mt-4 italic">— {guide.author}</p>
      </header>

      <div className="space-y-5">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-[15px] text-[var(--text-1)] leading-[1.75] whitespace-pre-line"
          >
            {p}
          </p>
        ))}
      </div>

      <footer className="mt-12 pt-6 border-t border-[var(--border)]">
        <Link
          href="/portal/practice"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-dim)] border border-[var(--border-accent)] text-[13px] font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/15 transition-colors"
        >
          <BookOpen size={14} /> Drill what you just learned
        </Link>
      </footer>
    </article>
  );
}
