import {
  Eyebrow, CTA,
  BgConstellationGrid, BgInkWash, BgAuroraNebula, BgCrescentMoon, BgFade,
  SignatureLine,
} from "@/components/system";

export const metadata = { title: "College Admissions" };

export default function CollegeAdmissionsPage() {
  return (
    <div className="relative">

      <section className="relative min-h-[600px] flex items-end overflow-hidden pt-[100px] md:pt-0">
        <BgConstellationGrid />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, transparent 0%, transparent 30%, rgba(7,9,20,0.85) 80%, var(--bg) 100%)" }}
        />
        <div className="relative w-full max-w-[1180px] mx-auto px-5 sm:px-8 pb-16 md:pb-20">
          <div className="max-w-3xl">
            <Eyebrow color="moon" className="mb-6">Admissions</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] tracking-[-0.02em] mb-7"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)" }}
            >
              Strategy, written by{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">people who just got in.</span>
            </h1>
            <p className="text-[var(--text-2)] text-[18px] leading-[1.7] max-w-2xl">
              Essay review, school list strategy, and interview prep — from students currently at
              Princeton, Harvard, Yale, Stanford, MIT, and Columbia.
            </p>
            <SignatureLine width={180} className="mt-9" />
          </div>
        </div>
      </section>

      <section className="relative py-28 md:py-32 overflow-hidden">
        <BgInkWash />
        <BgFade height={120} />
        <div className="relative max-w-[1100px] mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-2">
              <span className="block font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em] mb-3">01</span>
              <span className="block font-mono text-[#7dd3fc] text-[11px] uppercase tracking-[0.24em]">Essay</span>
            </div>
            <div className="md:col-span-10">
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.018em] mb-10 max-w-3xl"
                style={{ fontSize: "clamp(1.9rem, 4vw, 3.4rem)" }}
              >
                The essay is{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">a voice problem.</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-3xl text-[var(--text-2)] text-[16px] leading-[1.8]">
                <p>
                  Most essay help is grammar and structure. Ours is voice. We work line by line until
                  the page sounds like you on your best day.
                </p>
                <p>
                  We know what reads as &quot;trying too hard&quot; — and we know what an admissions
                  officer marks down as forgettable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <BgAuroraNebula />
        <BgFade height={120} />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(7,9,20,0.55) 40%, rgba(7,9,20,0.85) 100%)" }}
        />
        <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-8 py-20">
          <div className="max-w-[500px] ml-auto">
            <span className="block font-mono text-[#7dd3fc] text-[11px] uppercase tracking-[0.24em] mb-5">
              02 / School list
            </span>
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.018em] mb-7"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)" }}
            >
              Build the list around{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">fit, not name.</span>
            </h2>
            <p className="text-[var(--text-2)] text-[16px] leading-[1.8]">
              Reach, target, likely — sorted by what you actually want from college, not by US
              News rankings. We share the data we used when we built our own lists.
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-28 md:py-32 overflow-hidden">
        <BgInkWash />
        <BgFade height={120} />
        <div className="relative max-w-[1100px] mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-2">
              <span className="block font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em] mb-3">03</span>
              <span className="block font-mono text-[#7dd3fc] text-[11px] uppercase tracking-[0.24em]">Interview</span>
            </div>
            <div className="md:col-span-10">
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.018em] mb-10 max-w-3xl"
                style={{ fontSize: "clamp(1.9rem, 4vw, 3.4rem)" }}
              >
                Practice with someone{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">who&apos;s been on the other side.</span>
              </h2>
              <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-2xl">
                Mock interviews with current students who serve as alumni interviewers. We send a
                written debrief after every session — what landed, what didn&apos;t, what to drill.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <BgCrescentMoon position="upper-right" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, rgba(7,9,20,0.7) 0%, rgba(7,9,20,0.4) 35%, transparent 60%)" }}
        />
        <BgFade height={120} />
        <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-8 py-20">
          <div className="max-w-xl">
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] mb-7 tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
            >
              Talk to a{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">Nyx mentor.</span>
            </h2>
            <p className="text-[var(--text-2)] text-[17px] leading-[1.7] mb-10">
              A free 20-minute call to map your application.
            </p>
            <CTA href="/apply" size="lg">Book the call</CTA>
          </div>
        </div>
      </section>
    </div>
  );
}
