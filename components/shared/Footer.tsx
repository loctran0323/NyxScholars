import Link from "next/link";

const footerLinks = {
  Services: [
    { href: "/services", label: "All Services" },
    { href: "/sat-act", label: "SAT / ACT Prep" },
    { href: "/services#ap", label: "AP Tutoring" },
    { href: "/services#admissions", label: "Admissions Consulting" },
  ],
  Company: [
    { href: "/tutors", label: "Our Tutors" },
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
    { href: "/apply", label: "Book Consultation" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#060912]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#d4a853] to-[#a07830]" />
                <span className="relative text-black font-black text-sm">N</span>
              </div>
              <span className="font-semibold tracking-tight text-[17px] text-[#f0ece3]">
                Nyx<span className="text-[#d4a853]"> Scholars</span>
              </span>
            </Link>
            <p className="text-[#8d9ab0] text-[13.5px] leading-[1.8] max-w-sm mb-5">
              Premium SAT, ACT, and AP tutoring from Ivy League+ college mentors.
              Personalized 1:1 test prep for ambitious students.
            </p>
            <p className="text-[#4e5d72] text-[12px] leading-relaxed max-w-sm">
              Nyx Scholars does not guarantee test score increases or admissions outcomes.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[#f0ece3] font-semibold text-[12px] uppercase tracking-[0.12em] mb-5">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#8d9ab0] text-[13.5px] hover:text-[#d4a853] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#4e5d72] text-[12px]">
            &copy; {new Date().getFullYear()} Nyx Scholars. All rights reserved.
          </p>
          <p className="text-[#4e5d72] text-[12px]">
            Tutoring from students who recently succeeded at the highest level.
          </p>
        </div>
      </div>
    </footer>
  );
}
