import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/#how", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/tutors", label: "Vetting" },
  { href: "/faq", label: "FAQ" },
  { href: "/portal/login", label: "Sign in" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-7">
          <Link href="/" aria-label="Nyx Scholars" className="inline-block">
            <Image
              src="/design/primary-lockup.png"
              alt="Nyx Scholars"
              width={180}
              height={48}
              className="h-10 w-auto opacity-95"
            />
          </Link>

          <nav className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[var(--text-2)] hover:text-[var(--text-1)] text-[13.5px] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase" style={{ color: "var(--text-3)" }}>
            © {new Date().getFullYear()} Nyx Scholars · Per noctem ad lucem
          </p>
          <div className="flex items-center gap-5 text-[12px]" style={{ color: "var(--text-3)" }}>
            <a href="mailto:hello@nyxscholars.com" className="hover:text-[var(--text-1)] transition-colors">
              hello@nyxscholars.com
            </a>
            <span className="hidden sm:inline">·</span>
            <a href="mailto:tutors@nyxscholars.com" className="hover:text-[var(--text-1)] transition-colors">
              Apply to tutor
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
