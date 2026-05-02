import {
  Section, Eyebrow, Heading, Text, CTA, PhotoFrame,
  Drift, Arc, BlobGlow, SignatureLine,
} from "@/components/system";

export const metadata = { title: "College Admissions" };

const sections = [
  {
    n: "01",
    label: "Essay",
    title: "The essay is",
    titleItalic: "a voice problem.",
    body: "Most essay help is grammar and structure. Ours is voice. We work line by line until the page sounds like you on your best day — and we know what reads as 'trying too hard.'",
    seed: "essay",
  },
  {
    n: "02",
    label: "School list",
    title: "Build the list around",
    titleItalic: "fit, not name.",
    body: "Reach, target, likely — sorted by what you actually want from college, not by US News rankings. We share the data we used when we built our own lists.",
    seed: null,
  },
  {
    n: "03",
    label: "Interview",
    title: "Practice with someone",
    titleItalic: "who's been on the other side.",
    body: "Mock interviews with current students who serve as alumni interviewers. We send a written debrief after every session — what landed, what didn't, what to drill.",
    seed: null,
  },
];

export default function CollegeAdmissionsPage() {
  return (
    <div className="relative overflow-hidden">
      <section className="relative pt-[120px] md:pt-[160px] pb-24">
        <Drift density="med" seed={4} />
        <BlobGlow position="top-left" color="moon" size="xl" intensity={0.12} />

        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <Eyebrow color="moon" className="mb-6">Admissions</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.02] tracking-[-0.02em] mb-8"
              style={{ fontSize: "clamp(2.6rem, 6vw, 5.2rem)" }}
            >
              Strategy, written by{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">people who just got in.</span>
            </h1>
            <Text variant="lead" className="max-w-2xl">
              Essay review, school list strategy, and interview prep — from students currently at
              Princeton, Harvard, Yale, Stanford, MIT, and Columbia.
            </Text>
            <SignatureLine width={180} className="mt-10" />
          </div>
        </div>
      </section>

      <Arc direction="up" intensity="medium" />

      {/* Long-form sections, alternating sides */}
      {sections.map((s, i) => (
        <section
          key={s.n}
          className={`relative py-20 md:py-28 ${i % 2 === 1 ? "bg-[var(--bg-2)]" : ""} overflow-hidden`}
        >
          <Drift density="low" seed={i * 17 + 11} className="opacity-30" />
          <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8">
            <div className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-center ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
              <div className={`lg:col-span-7 lg:[direction:ltr] relative ${s.seed ? "h-[360px] lg:h-[460px]" : ""}`}>
                {s.seed ? (
                  <div className={`absolute inset-0 ${i % 2 === 0 ? "rotate-[-1.5deg]" : "rotate-[1.5deg]"}`}>
                    <PhotoFrame alt={s.label} aspect="landscape" rounded="lg" seed={s.seed} className="h-full" />
                  </div>
                ) : (
                  <div
                    aria-hidden
                    className="h-[280px] rounded-[28px] bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden"
                  >
                    <Drift density="high" seed={i * 5 + 3} />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "radial-gradient(ellipse at 30% 30%, rgba(125, 211, 252, 0.10), transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(200, 162, 75, 0.08), transparent 60%)",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 lg:[direction:ltr]">
                <span className="block font-mono text-[var(--accent)] text-[12px] uppercase tracking-[0.22em] mb-5">
                  {s.n} / {s.label}
                </span>
                <h2
                  className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.015em] mb-8"
                  style={{ fontSize: "clamp(1.9rem, 3.6vw, 3rem)" }}
                >
                  {s.title}{" "}
                  <span className="font-[family-name:var(--font-cormorant)] italic font-normal">
                    {s.titleItalic}
                  </span>
                </h2>
                <Text variant="body">{s.body}</Text>
              </div>
            </div>
          </div>
        </section>
      ))}

      <Arc direction="up" intensity="strong" color="moon" />

      <section className="relative py-32 md:py-40 overflow-hidden">
        <Drift density="med" seed={66} />
        <BlobGlow position="center" color="moon" size="xl" intensity={0.14} />

        <div className="relative max-w-2xl mx-auto px-5 text-center">
          <h2
            className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] mb-8 tracking-[-0.02em]"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            Talk to a{" "}
            <span className="font-[family-name:var(--font-cormorant)] italic">Nyx mentor.</span>
          </h2>
          <Text variant="lead" className="mb-10 text-[var(--text-2)]">A free 20-minute call to map your application.</Text>
          <CTA href="/apply" size="lg">Book the call</CTA>
        </div>
      </section>
    </div>
  );
}
