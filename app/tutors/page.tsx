import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, Lightbulb, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Meet the Founders",
  description: "Nyx Scholars was founded by two Princeton students — Loc Tran and Charles Muehlberger.",
};

const founders = [
  {
    name: "Loc Tran",
    school: "Princeton University",
    major: "Operations Research & Financial Engineering",
    year: "Class of 2027",
    focus: ["SAT & ACT Math", "AP Calculus", "AP Statistics", "College Admissions"],
    bio: "Loc built Nyx Scholars from a simple belief: the best tutors are the ones who just went through it. Studying ORFE at Princeton — one of the most quantitative programs in the country — he brings a rigorous, analytical approach to every subject he teaches. He knows what it takes to navigate competitive college admissions firsthand, and he's committed to giving every student the same edge.",
    initials: "LT",
  },
  {
    name: "Charles Muehlberger",
    school: "Princeton University",
    major: "Electrical & Computer Engineering",
    year: "Class of 2027",
    focus: ["AP Physics", "AP Computer Science", "SAT & ACT Math", "College Admissions"],
    bio: "Charles co-founded Nyx Scholars to make high-quality tutoring feel like advice from a friend who actually knows the material. As an ECE student at Princeton, he brings deep technical fluency to math and science subjects — and a straightforward communication style that makes even the hardest concepts click. He cares about students building real understanding, not just hitting the right answer.",
    initials: "CM",
  },
];

export default function TutorsPage() {
  return (
    <div className="pt-[68px]">

      {/* Hero */}
      <section className="relative py-24 px-5 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,168,83,0.14) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-5">The Founders</p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-[#f0ece3] leading-tight tracking-tight mb-5">
            Meet the people behind Nyx Scholars.
          </h1>
          <p className="text-[#8d9ab0] text-[16px] leading-[1.8]">
            Two Princeton students who built the tutoring resource they wish they&apos;d had — grounded in real experience, not scripts.
          </p>
        </div>
      </section>

      {/* Founder cards */}
      <section className="pb-24 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {founders.map((f) => (
            <div
              key={f.name}
              className="rounded-2xl bg-[#0f1521] p-8"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 16px 48px rgba(0,0,0,0.5)" }}
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4a853]/20 to-[#d4a853]/5 border border-[#d4a853]/20 flex items-center justify-center mb-6">
                <span className="text-[18px] font-bold text-[#d4a853]">{f.initials}</span>
              </div>

              {/* Name + school */}
              <h2 className="text-[22px] font-bold text-[#f0ece3] mb-1 tracking-tight">{f.name}</h2>
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap size={13} className="text-[#d4a853] shrink-0" />
                <p className="text-[#d4a853] text-[13px] font-medium">{f.school} · {f.year}</p>
              </div>
              <p className="text-[#8d9ab0] text-[13px] mb-5">{f.major}</p>

              {/* Bio */}
              <p className="text-[#c8d0de] text-[14px] leading-[1.8] mb-6">{f.bio}</p>

              {/* Focus areas */}
              <div>
                <p className="text-[11px] text-[#4e5d72] font-semibold uppercase tracking-wider mb-2.5">Focuses on</p>
                <div className="flex flex-wrap gap-2">
                  {f.focus.map((area) => (
                    <span
                      key={area}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-[#8d9ab0] text-[12px] font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why we started this */}
      <section className="py-20 bg-[#0b0f1a] border-y border-white/[0.05]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb size={16} className="text-[#d4a853]" />
            <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em]">Why We Built This</p>
          </div>
          <h2 className="text-[1.7rem] font-bold text-[#f0ece3] tracking-tight mb-5 leading-tight">
            The tutoring we wish we&apos;d had.
          </h2>
          <div className="space-y-4 text-[#8d9ab0] text-[15px] leading-[1.85]">
            <p>
              Most tutoring services assign you whoever is available — often a graduate student or adult professional
              who learned the SAT a decade ago. The format has changed. The scoring has changed. What works has changed.
            </p>
            <p>
              We started Nyx Scholars because we just went through the process ourselves. We know what the current exams
              look like, what colleges are actually reading for in essays, and what makes the difference between a good score
              and a great one. That knowledge has a short shelf life — and we&apos;re using it while it&apos;s current.
            </p>
            <p>
              Every student we work with gets direct access to us — not a tutor-match algorithm or an anonymous
              platform. We keep our student count intentionally small so the quality stays high.
            </p>
          </div>
        </div>
      </section>

      {/* Princeton credibility strip */}
      <section className="py-16 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: GraduationCap, title: "Princeton University", desc: "Both founders are current Princeton students — ranked #1 nationally." },
              { icon: Users, title: "Small by Design", desc: "We work with a limited number of students so every engagement gets real attention." },
              { icon: Lightbulb, title: "Fresh Perspective", desc: "We took these exams recently. We know what's on them and what actually works." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-xl border border-white/[0.07] bg-[#0f1521]">
                <Icon size={16} className="text-[#d4a853] mb-3" />
                <h3 className="text-[#f0ece3] font-semibold mb-1.5 text-[14px]">{title}</h3>
                <p className="text-[#8d9ab0] text-[13px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-5 bg-[#0b0f1a] border-t border-white/[0.05]">
        <h2 className="text-[2rem] font-bold text-[#f0ece3] mb-4 tracking-tight">Work with us directly.</h2>
        <p className="text-[#8d9ab0] mb-8 max-w-md mx-auto text-[15px]">Book a free 20-minute call and you&apos;ll talk to one of us — not a sales rep.</p>
        <Link
          href="/apply"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black font-bold hover:from-[#eac068] hover:to-[#d4a045] transition-all shadow-[0_8px_32px_rgba(212,168,83,0.3)] hover:-translate-y-0.5"
        >
          Book Free Consultation <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
