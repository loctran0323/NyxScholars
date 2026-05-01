import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import TutorCard from "@/components/shared/TutorCard";

export const metadata: Metadata = {
  title: "Our Tutors",
  description: "Meet our Ivy League+ tutors — Princeton, Harvard, Yale, MIT, Columbia, and Stanford students.",
};

const tutors = [
  {
    name: "Aiden Park",
    school: "Princeton",
    major: "Mathematics",
    subjects: ["SAT Math", "ACT Math", "AP Calculus BC", "AP Statistics"],
    bio: "Scored in the 99th percentile on the SAT with a 1590. Helps students break through math anxiety with step-by-step explanations focused on pattern recognition.",
    testStrengths: ["SAT 1590", "AP Calc BC: 5", "AP Stats: 5"],
  },
  {
    name: "Maya Chen",
    school: "Harvard",
    major: "Cognitive Science",
    subjects: ["SAT Reading & Writing", "ACT English", "AP English Language", "AP Psychology"],
    bio: "Consistently top-scored on the verbal sections of the SAT and ACT. Specializes in evidence-based reading strategies and grammar rules that actually stick.",
    testStrengths: ["SAT 800 EBRW", "ACT 36 English", "AP Lang: 5"],
  },
  {
    name: "Jordan Lee",
    school: "MIT",
    major: "Physics",
    subjects: ["AP Physics C", "AP Physics 1 & 2", "SAT Math", "ACT Science"],
    bio: "Physics obsessive with a gift for connecting abstract concepts to real problems. Makes ACT Science approachable and AP Physics less intimidating at any level.",
    testStrengths: ["AP Physics C: 5", "ACT 36 Science", "SAT 800 Math"],
  },
  {
    name: "Sofia Reyes",
    school: "Yale",
    major: "Molecular Biology",
    subjects: ["AP Biology", "AP Chemistry", "SAT", "AP Environmental Science"],
    bio: "Pre-med with deep AP science expertise. Known for breaking down complex bio and chem content into memorable frameworks that hold up under exam pressure.",
    testStrengths: ["AP Bio: 5", "AP Chem: 5", "SAT 1540"],
  },
  {
    name: "Marcus Williams",
    school: "Columbia",
    major: "History & Political Science",
    subjects: ["AP US History", "AP World History", "AP Government", "SAT Reading"],
    bio: "Makes history feel manageable and relevant. Helps students master the essay and short-answer components that define AP history scores.",
    testStrengths: ["APUSH: 5", "AP World: 5", "SAT 1520"],
  },
  {
    name: "Priya Nair",
    school: "Stanford",
    major: "Computer Science",
    subjects: ["AP Computer Science A", "SAT Math", "ACT Math", "AP Calculus AB"],
    bio: "Strong technical foundation with a clear communication style. Bridges abstract CS concepts and the AP exam format — quickly builds student confidence.",
    testStrengths: ["AP CS A: 5", "SAT 800 Math", "AP Calc AB: 5"],
  },
];

export default function TutorsPage() {
  return (
    <div className="pt-[68px]">

      {/* Header */}
      <section className="relative py-24 px-5 sm:px-8">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,168,83,0.13) 0%, transparent 60%)" }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-5">Our Tutors</p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-[#f0ece3] leading-tight tracking-tight mb-5">
            High-achievers who know how to teach.
          </h1>
          <p className="text-[#8d9ab0] text-[16px] leading-[1.8] mb-8">
            Selected for academic performance, communication skill, and genuine interest in helping others succeed — not just their scores.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.07] bg-[#0f1521] text-[#8d9ab0] text-[13px]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4a853]/60" />
            Tutor availability varies. Students are matched based on subject, goals, and schedule.
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-24 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tutors.map((tutor) => <TutorCard key={tutor.name} {...tutor} />)}
        </div>
      </section>

      {/* Quality section */}
      <section className="py-20 bg-[#0b0f1a] border-y border-white/[0.05]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <SectionHeader eyebrow="Our Standard" title="What makes a Nyx Scholars tutor." centered className="mb-12" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "Top University Enrollment", desc: "Current students at Ivy League or equivalent institutions with strong academic standing." },
              { title: "Recent Test Experience", desc: "Tutors who recently aced the same exams and understand the current format firsthand." },
              { title: "Communication Ability", desc: "Selected for ability to break down complex material clearly — not just their scores." },
            ].map(({ title, desc }) => (
              <div key={title} className="p-6 rounded-xl border border-white/[0.07] bg-[#0f1521]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a853] mx-auto mb-4" />
                <h3 className="text-[#f0ece3] font-semibold mb-2 text-[14.5px]">{title}</h3>
                <p className="text-[#8d9ab0] text-[13px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-5">
        <h2 className="text-[2rem] font-bold text-[#f0ece3] mb-4 tracking-tight">Ready to get matched?</h2>
        <p className="text-[#8d9ab0] mb-8 max-w-md mx-auto text-[15px]">Tell us your subject, goals, and schedule — we&apos;ll find the right tutor for you.</p>
        <Link href="/apply" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black font-bold hover:from-[#eac068] hover:to-[#d4a045] transition-all shadow-[0_8px_32px_rgba(212,168,83,0.3)] hover:-translate-y-0.5">
          Book Free Consultation <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
