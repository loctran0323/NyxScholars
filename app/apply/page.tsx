import {
  Eyebrow, Text, PhotoFrame,
  Drift, BlobGlow, NyxMark,
} from "@/components/system";
import LeadForm from "@/components/shared/LeadForm";

export const metadata = {
  title: "Apply",
  description: "Submit an inquiry for a free 20-minute consultation with Nyx.",
};

export default function ApplyPage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      <Drift density="med" seed={50} />
      <BlobGlow position="top-right" color="gold" size="xl" intensity={0.14} />
      <BlobGlow position="bottom-left" color="moon" size="lg" intensity={0.08} />

      <section className="relative pt-[120px] md:pt-[160px] pb-32">
        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left rail — flowing copy + photo + crescent ornament */}
            <div className="lg:col-span-5 relative">
              <Eyebrow color="brass" className="mb-6">Free consultation</Eyebrow>
              <h1
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.02] tracking-[-0.02em] mb-8"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.4rem)" }}
              >
                Tell us{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">where you are.</span>
              </h1>
              <Text variant="lead" className="mb-12">
                Two minutes to fill out, twenty minutes on a call. We&apos;ll map your prep and tell you
                exactly which Nyx plan fits — or that none do.
              </Text>

              <div className="hidden lg:block relative h-[320px]">
                <NyxMark size={180} showRing className="absolute -top-6 -left-6 opacity-20 pointer-events-none" />
                <div className="absolute inset-0 rotate-[-2deg]">
                  <PhotoFrame
                    alt="Late-night study"
                    aspect="landscape"
                    rounded="lg"
                    seed="apply-photo"
                    mask="bottom"
                    className="h-full"
                  />
                </div>
              </div>
            </div>

            {/* Form — frameless, on a soft glow background */}
            <div className="lg:col-span-7 relative">
              <div
                aria-hidden
                className="absolute -inset-6 rounded-[40px] pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(232, 204, 126, 0.06), transparent 70%)",
                }}
              />
              <div className="relative bg-[var(--surface-elevated)]/85 backdrop-blur-md border border-[var(--border-2)] rounded-[28px] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
                <LeadForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
