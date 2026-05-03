import Link from "next/link";
import { Section, Heading, Text, Eyebrow } from "@/components/system";
import { Download, Mail } from "lucide-react";

export const metadata = {
  title: "Press",
  description: "Press kit, brand assets, and contact for journalists.",
};

const PRESS_LINKS = [
  { label: "Brand kit (.zip)",   href: "/press/nyx-brand-kit.zip" },
  { label: "Logos (SVG/PNG)",    href: "/press/logos.zip" },
  { label: "Tutor headshots",    href: "/press/tutor-headshots.zip" },
  { label: "Founder photos",     href: "/press/founders.zip" },
  { label: "Stat sheet (PDF)",   href: "/press/stat-sheet.pdf" },
];

export default function PressPage() {
  return (
    <Section>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Eyebrow>Press &amp; brand</Eyebrow>
        <Heading as="h1" size="display">
          Materials for journalists, partners, and parents&apos; magazines.
        </Heading>
        <Text muted className="mt-3">
          Everything below is licensed for editorial use without prior approval. For interviews, original
          quotes, or custom assets, email <a className="text-[var(--accent)]" href="mailto:press@nyxscholars.com">press@nyxscholars.com</a>.
        </Text>
      </div>

      <div className="max-w-2xl mx-auto space-y-3">
        {PRESS_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-2)] transition-colors"
          >
            <span className="text-[14px] text-[var(--text-1)] font-semibold">{link.label}</span>
            <Download size={14} className="text-[var(--text-3)]" />
          </a>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="mailto:press@nyxscholars.com"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--gold-soft)] text-[var(--on-gold)] font-semibold text-[14px] hover:bg-[var(--gold-bright)] transition-colors"
        >
          <Mail size={14} /> Email press@nyxscholars.com
        </Link>
      </div>
    </Section>
  );
}
