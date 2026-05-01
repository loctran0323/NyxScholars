import type { Metadata } from "next";
import LeadForm from "@/components/shared/LeadForm";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Submit an inquiry to get matched with a Nyx Scholars tutor. Free 20-minute consultation included.",
};

export default function ApplyPage() {
  return (
    <div className="pt-[68px]">
      <section className="relative min-h-screen py-20 px-5 sm:px-8">

        {/* Background */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(212,168,83,0.12) 0%, transparent 55%)" }} />

        <div className="relative max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-5 gold-line">Get Started</p>
            <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-bold text-[#f0ece3] leading-tight tracking-tight mb-4">
              Book a free consultation.
            </h1>
            <p className="text-[#8d9ab0] text-[16px] leading-[1.8]">
              Fill out the form and we&apos;ll reach out within 24 hours to schedule your free 20-minute call.
            </p>
          </div>

          {/* Trust row */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { label: "Free", sub: "20-min consultation" },
              { label: "No pressure", sub: "Just a conversation" },
              { label: "Fast match", sub: "Right tutor for you" },
            ].map(({ label, sub }) => (
              <div key={label} className="text-center p-4 rounded-xl border border-white/[0.07] bg-[#0f1521]">
                <p className="text-[#d4a853] font-bold text-[14px]">{label}</p>
                <p className="text-[#4e5d72] text-[11.5px] mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0f1521] p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.4)]">
            <LeadForm />
          </div>
        </div>
      </section>
    </div>
  );
}
