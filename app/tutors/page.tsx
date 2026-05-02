import Link from "next/link";
import {
  Eyebrow, CTA,
  BgInkWash, BgFade,
} from "@/components/system";

export const metadata = { title: "Vetting" };

const steps = [
  {
    n: "01", title: "Score floor.",
    body: "Verified 1500+ on the digital SAT. No exceptions, including for the founders.",
  },
  {
    n: "02", title: "Currently enrolled.",
    body: "Active undergraduates at Princeton, Harvard, Yale, MIT, Stanford, Columbia, or peer schools. Re-verified each semester.",
  },
  {
    n: "03", title: "Teaching audition.",
    body: "Thirty-minute mock session with a founder, walking through a real student case.",
  },
  {
    n: "04", title: "Trial cohort.",
    body: "Approved tutors take on two trial students with founder shadowing on the first session. Honest feedback decides whether they stay.",
  },
];

export default function VettingPage() {
  return (
    <div className="relative">
      <section className="relative pt-[120px] md:pt-[160px] pb-16 overflow-hidden">
        <BgInkWash />
        <BgFade top={false} bottom height={120} />

        <div className="relative max-w-[900px] mx-auto px-5 sm:px-8">
          <Eyebrow color="brass" className="mb-6">Vetting</Eyebrow>
          <h1
            className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] tracking-[-0.02em] mb-6"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)" }}
          >
            How we hire tutors.
          </h1>
          <p className="text-[var(--text-2)] text-[16.5px] leading-[1.7] max-w-2xl">
            We don&rsquo;t list our tutors publicly — partly because the roster is small,
            partly because what matters is the process they passed before they ever met a
            student. You meet your matched tutor at the start of your free trial.
          </p>
        </div>
      </section>

      <section className="relative py-16 md:py-20">
        <div className="max-w-[900px] mx-auto px-5 sm:px-8 space-y-10">
          {steps.map((s) => (
            <div key={s.n} className="grid md:grid-cols-12 gap-x-8 gap-y-3">
              <div className="md:col-span-2">
                <span
                  className="font-[family-name:var(--font-fraunces)] italic block"
                  style={{ color: "#7dd3fc", fontSize: 28, lineHeight: 1 }}
                >
                  {s.n}
                </span>
              </div>
              <div className="md:col-span-10">
                <h3
                  className="font-[family-name:var(--font-fraunces)] font-medium text-[var(--text-1)] leading-[1.2] mb-2"
                  style={{ fontSize: 22 }}
                >
                  {s.title}
                </h3>
                <p className="text-[var(--text-2)] text-[15.5px] leading-[1.75]">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative py-16 border-t border-[var(--border)]">
        <div className="max-w-[900px] mx-auto px-5 sm:px-8 grid sm:grid-cols-2 gap-x-12 gap-y-8 items-start">
          <div>
            <h3
              className="font-[family-name:var(--font-fraunces)] font-medium text-[var(--text-1)] mb-3"
              style={{ fontSize: 20 }}
            >
              Want to tutor on Nyx?
            </h3>
            <p className="text-[var(--text-2)] text-[14.5px] leading-[1.7] mb-4">
              Cleared the criteria above? Write to us. We pay tutors well, take a small cut to keep
              the platform running, and only onboard people we&rsquo;d book ourselves.
            </p>
            <Link
              href="mailto:tutors@nyxscholars.com"
              className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-bright)] text-[12px] font-medium transition-colors group font-mono uppercase tracking-[0.24em]"
            >
              tutors@nyxscholars.com →
            </Link>
          </div>
          <div>
            <h3
              className="font-[family-name:var(--font-fraunces)] font-medium text-[var(--text-1)] mb-3"
              style={{ fontSize: 20 }}
            >
              Want to be tutored?
            </h3>
            <p className="text-[var(--text-2)] text-[14.5px] leading-[1.7] mb-5">
              Twelve-minute intake matches you to whoever covers your gaps. Free trial after that.
            </p>
            <CTA href="/match" size="default">Get matched</CTA>
          </div>
        </div>
      </section>
    </div>
  );
}
