import {
  Eyebrow,
  BgConstellationGrid, BgFade,
} from "@/components/system";
import LeadForm from "@/components/shared/LeadForm";

export const metadata = {
  title: "Apply",
  description: "Submit an inquiry for a free 20-minute consultation with Nyx.",
};

export default function ApplyPage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      <BgConstellationGrid />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,9,20,0.55) 0%, rgba(7,9,20,0.35) 35%, rgba(7,9,20,0.85) 100%)",
        }}
      />
      <BgFade top={false} bottom height={140} />

      <section className="relative pt-[120px] md:pt-[160px] pb-32">
        <div className="relative max-w-[1320px] mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5 relative pt-8 lg:pt-16">
            <Eyebrow color="brass" className="mb-6">Free consultation</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] tracking-[-0.02em] mb-9"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.4rem)" }}
            >
              Tell us{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">where you are.</span>
            </h1>
            <p className="text-[var(--text-2)] text-[17px] leading-[1.75] max-w-md mb-12">
              Two minutes to fill out, twenty minutes on a call. We&apos;ll map your prep and tell you
              exactly which Nyx plan fits — or that none do.
            </p>

            <div className="hidden lg:block max-w-md space-y-6 pt-2 border-t border-[var(--border)]/60">
              <div className="pt-6">
                <span className="block font-mono text-[var(--text-3)] text-[10px] uppercase tracking-[0.24em] mb-1">A few minutes</span>
                <span className="block text-[var(--text-1)] text-[14px] leading-relaxed">Average submission takes under three minutes.</span>
              </div>
              <div>
                <span className="block font-mono text-[var(--text-3)] text-[10px] uppercase tracking-[0.24em] mb-1">No commitment</span>
                <span className="block text-[var(--text-1)] text-[14px] leading-relaxed">The consultation is free. We&apos;ll be honest if Nyx is not a fit.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <span className="hidden lg:block absolute -top-8 -left-4 font-mono text-[var(--text-3)] text-[10px] uppercase tracking-[0.24em]">
              01 / Inquiry
            </span>
            <div className="relative bg-[#0c1124]/85 backdrop-blur-sm border border-[var(--border)] rounded-[18px] p-7 sm:p-9">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
