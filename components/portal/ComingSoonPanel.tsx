import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface ComingSoonPanelProps {
  feature: string;
  title: string;
  italic?: string;
  blurb: string;
  highlights?: string[];
  eta?: string;
  backHref?: string;
  backLabel?: string;
}

export function ComingSoonPanel({
  feature,
  title,
  italic,
  blurb,
  highlights,
  eta,
  backHref = "/portal",
  backLabel = "Back to dashboard",
}: ComingSoonPanelProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-3)] hover:text-[var(--text-1)] uppercase tracking-[0.2em] font-mono mb-6"
      >
        <ArrowLeft size={12} /> {backLabel}
      </Link>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 20% 30%, white, transparent 60%), radial-gradient(1px 1px at 70% 60%, white, transparent 60%), radial-gradient(1px 1px at 50% 80%, white, transparent 60%)",
            backgroundSize: "200px 200px",
          }}
        />
        <div className="relative">
          <p className="text-[10.5px] uppercase tracking-[0.22em] text-[var(--accent)] font-semibold mb-3 inline-flex items-center gap-1.5">
            <Sparkles size={11} /> {feature} · Coming soon
          </p>
          <h1 className="text-[28px] sm:text-[32px] font-light font-[family-name:var(--font-fraunces)] text-[var(--text-1)] leading-tight">
            {title}
            {italic && (
              <>
                {" "}
                <em className="text-[var(--accent)]">{italic}</em>
              </>
            )}
          </h1>
          <p className="mt-4 text-[14px] text-[var(--text-2)] leading-relaxed max-w-xl">{blurb}</p>

          {highlights && highlights.length > 0 && (
            <ul className="mt-6 space-y-2">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-[13.5px] text-[var(--text-1)] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          )}

          {eta && (
            <p className="mt-6 text-[11.5px] font-mono uppercase tracking-[0.18em] text-[var(--text-3)]">
              Expected: {eta}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
