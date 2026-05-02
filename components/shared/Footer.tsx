import Link from "next/link";
import { NyxLockup } from "@/components/system";

const footerLinks = {
  Services: [
    { href: "/services", label: "All Services" },
    { href: "/sat-act", label: "SAT / ACT Prep" },
    { href: "/services#ap", label: "AP Tutoring" },
    { href: "/services#admissions", label: "Admissions" },
  ],
  Company: [
    { href: "/tutors", label: "Founders" },
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
    { href: "/apply", label: "Book Consultation" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <NyxLockup size="md" />
            </Link>
            <p className="text-[var(--text-2)] text-[13.5px] leading-[1.8] max-w-sm mb-5">
              Adaptive SAT preparation built around your gaps, your pace, and your target score —
              calibrated by Ivy-tier students.
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
            Calibrated by students who recently scored at the top.
          </p>
        </div>
      </div>
    </footer>
  );
}
