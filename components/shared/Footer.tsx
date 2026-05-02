import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Nyx: [
    { href: "/#how", label: "How it works" },
    { href: "/tutors", label: "Vetting" },
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
  ],
  Account: [
    { href: "/match", label: "Get matched" },
    { href: "/portal/login", label: "Sign in" },
    { href: "mailto:hello@nyxscholars.com", label: "Contact" },
    { href: "mailto:tutors@nyxscholars.com", label: "Apply to tutor" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6 relative" aria-label="Nyx">
              <Image
                src="/design/primary-lockup.png"
                alt="Nyx Scholars"
                width={220}
                height={56}
                className="h-12 w-auto opacity-95"
                priority={false}
              />
            </Link>
            <p className="text-[var(--text-2)] text-[13.5px] leading-[1.8] max-w-sm mb-5">
              1:1 SAT, ACT, AP, and admissions tutoring with vetted undergrads. Online, by the
              session, with a free 30-minute trial.
            </p>
            <p className="text-[var(--text-3)] text-[12px] leading-relaxed max-w-sm">
              Nyx does not guarantee test score increases or admissions outcomes.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[var(--text-1)] font-semibold text-[12px] uppercase tracking-[0.14em] mb-5">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[var(--text-2)] text-[13.5px] hover:text-[var(--accent)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-3)] text-[12px]">
            &copy; {new Date().getFullYear()} Nyx. All rights reserved.
          </p>
          <p className="text-[var(--text-3)] text-[12px] font-mono uppercase tracking-[0.14em]">
            Per noctem ad lucem · Taught by the test we just took.
          </p>
        </div>
      </div>
    </footer>
  );
}
