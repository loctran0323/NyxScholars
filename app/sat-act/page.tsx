import type { Metadata } from "next";
import Link from "next/link";
import { Target, CheckCircle2, ArrowRight, BarChart, Clock, BookOpen, Brain, TrendingUp } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

export const metadata: Metadata = {
  title: "SAT & ACT Prep",
  description: "1:1 SAT and ACT tutoring from Ivy League+ mentors. Diagnostic planning, weekly sessions, and real test-taking strategy.",
};

const studentGets = [
  { icon: BarChart, title: "Diagnostic Plan", desc: "Identify gaps, strengths, and which question types are costing the most points — before a single session." },
  { icon: Clock, title: "Weekly Tutoring", desc: "Structured 1:1 sessions on content, strategy, and test simulation. Not generic review." },
  { icon: BookOpen, title: "Homework Plan", desc: "Targeted practice problems between sessions that reinforce what was actually covered." },
  { icon: Brain, title: "Error Log Review", desc: "Every missed question is tracked. Prep gets smarter over time, not just bigger." },
  { icon: Target, title: "Test-Taking Strategy", desc: "Pacing, elimination, and section tactics that give students a real edge on exam day." },
  { icon: TrendingUp, title: "Progress Tracking", desc: "Practice scores reviewed every session so you always know where you stand." },
];

const goodFit = [
  "Aiming for a meaningful score increase (100+ SAT points / 2+ ACT composite)",
  "Stuck at a score plateau despite studying on your own",
  "Need structure, accountability, and a consistent plan",
  "Have a specific upcoming exam date to hit",
  "Want to understand the test — not just memorize tricks",
];

export default function SatActPage() {
  return (
    <div className="pt-[68px]">

      {/* Hero */}
      <section className="relative py-24 px-5 sm:px-8">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,168,83,0.15) 0%, transparent 60%)" }} />
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-5 gold-line">SAT & ACT Prep</p>
            <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-bold text-[#f0ece3] leading-tight tracking-tight mb-6">
              More than practice problems.
            </h1>
            <p className="text-[17px] text-[#8d9ab0] leading-[1.8] mb-10">
              Most students plateau because they practice without strategy. Nyx Scholars builds a real plan —
              diagnostic to exam day — based on your specific gaps and test date.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/apply" className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black font-bold hover:from-[#eac068] hover:to-[#d4a045] transition-all shadow-[0_8px_32px_rgba(212,168,83,0.3)] hover:-translate-y-0.5">
                Book Free Consultation <ArrowRight size={16} />
              </Link>
              <Link href="/tutors" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 text-[#c8d0de] font-semibold hover:border-white/20 hover:bg-white/[0.04] transition-all">
                Meet the Tutors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-20 bg-[#0b0f1a] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="Why It Matters" title="Why practice alone isn't enough." subtitle="Practice tests without review, drilling problems you already understand, and skipping error analysis — these are the most common reasons smart students stop improving." className="mb-12 max-w-2xl" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "Untargeted practice", desc: "Generic worksheets and prep books don't account for where your specific points are being lost.", accent: false },
              { title: "No error analysis", desc: "Without reviewing why you missed questions, the same mistakes repeat on every test.", accent: false },
              { title: "Structured gap work", desc: "We identify exactly which question types and content areas to focus on — and nothing else.", accent: true },
            ].map(({ title, desc, accent }) => (
              <div key={title} className={`p-6 rounded-xl border ${accent ? "border-[#d4a853]/25 bg-[#d4a853]/[0.04]" : "border-white/[0.07] bg-[#0f1521]"}`}>
                <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${accent ? "text-[#d4a853]" : "text-[#4e5d72]"}`}>
                  {accent ? "Our approach" : "Common mistake"}
                </p>
                <h3 className="text-[#f0ece3] font-semibold mb-2 text-[15px]">{title}</h3>
                <p className="text-[#8d9ab0] text-[13.5px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What students get */}
      <section className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
        <SectionHeader eyebrow="What You Get" title="Everything in your prep, structured." subtitle="A clear system from start to finish — not a random pile of practice problems." centered className="mb-12" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentGets.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl border border-white/[0.07] bg-[#0f1521] hover:border-[#d4a853]/25 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#d4a853]/10 border border-[#d4a853]/10 flex items-center justify-center mb-4">
                <Icon size={18} className="text-[#d4a853]" />
              </div>
              <h3 className="text-[#f0ece3] font-semibold mb-2 text-[15px]">{title}</h3>
              <p className="text-[#8d9ab0] text-[13.5px] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SAT vs ACT */}
      <section className="py-20 bg-[#0b0f1a] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="SAT vs ACT" title="Not sure which test to take?" subtitle="We help students figure out which test fits their strengths — and prepare for whichever they choose." className="mb-10" />
          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            {[
              { label: "SAT", color: "#d4a853", items: ["Math-heavy structure", "Evidence-based Reading & Writing", "No penalty for guessing", "Digital format"] },
              { label: "ACT", color: "#7aa0d4", items: ["Four sections including Science", "Faster pacing overall", "More straightforward Math", "Paper and digital options"] },
            ].map(({ label, color, items }) => (
              <div key={label} className="p-6 rounded-2xl border" style={{ borderColor: `${color}25`, background: `${color}06` }}>
                <h3 className="font-bold text-[1.2rem] mb-5" style={{ color }}>{label}</h3>
                <ul className="space-y-2.5">
                  {items.map((h) => (
                    <li key={h} className="flex items-center gap-2.5 text-[#c8d0de] text-[13.5px]">
                      <CheckCircle2 size={14} style={{ color }} className="shrink-0" /> {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-[#4e5d72] text-[13px]">Not sure which to take? Mention it in your consultation — we&apos;ll help you decide based on your strengths.</p>
        </div>
      </section>

      {/* Good fit for */}
      <section className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <SectionHeader eyebrow="Good Fit For" title="Is Nyx Scholars right for you?" subtitle="Our prep works best for students who are ready to put in real effort and want focused, strategic support to get there." />
          <div className="space-y-3">
            {goodFit.map((item) => (
              <div key={item} className="flex items-start gap-3.5 p-4 rounded-xl border border-[#d4a853]/15 bg-[#d4a853]/[0.04]">
                <CheckCircle2 size={15} className="text-[#d4a853] shrink-0 mt-0.5" />
                <p className="text-[#c8d0de] text-[13.5px] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-5 bg-[#0b0f1a] border-t border-white/[0.05]">
        <h2 className="text-[2rem] font-bold text-[#f0ece3] mb-4 tracking-tight">Ready to build your prep plan?</h2>
        <p className="text-[#8d9ab0] mb-8 max-w-md mx-auto text-[15px]">Start with a free consultation. We&apos;ll review your target score, test date, and current level — then build from there.</p>
        <Link href="/apply" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black font-bold hover:from-[#eac068] hover:to-[#d4a045] transition-all shadow-[0_8px_32px_rgba(212,168,83,0.3)] hover:-translate-y-0.5">
          Book Free Consultation <ArrowRight size={16} />
        </Link>
        <p className="mt-6 text-[#4e5d72] text-[12px]">Nyx Scholars does not guarantee test score increases or admissions outcomes.</p>
      </section>
    </div>
  );
}
