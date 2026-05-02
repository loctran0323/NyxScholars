import Link from "next/link";
import {
  CTA,
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
      <section className="relative pt-[140px] md:pt-[180px] pb-16 overflow-hidden">
        <BgInkWash />
        <BgFade top={false} bottom height={120} />

        <div className="relative max-w-[860px] mx-auto px-6 sm:px-10">
          <p className="font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.28em] mb-6">
            <span className="gold-line" />Vetting
          </p>
          <h1
            className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.02em] mb-7 read-default"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)" }}
          >
            How we hire tutors.
          </h1>
          <p className="text-[var(--text-2)] text-[17px] leading-[1.8] read-default">
            We don&rsquo;t list our tutors publicly — partly because the roster is small,
            partly because what matters is the process they passed before they ever met a student.
            You meet your matched tutor at the start of your free trial.
          </p>
        </div>
      </section>

      <section className="relative py-20 md:py-24">
        <div className="max-w-[860px] mx-auto px-6 sm:px-10 space-y-14">
          {steps.map((s) => (
            <div key={s.n} className="grid md:grid-cols-12 gap-x-10 gap-y-3">
              <div className="md:col-span-2">
                <span
                  className="font-[family-name:var(--font-fraunces)] italic block"
                  style={{ color: "var(--accent)", fontSize: 30, lineHeight: 1 }}
                >
                  {s.n}
                </span>
              </div>
              <div className="md:col-span-10 read-default">
                <h3
                  className="font-[family-name:var(--font-fraunces)] font-medium text-[var(--text-1)] leading-[1.25] mb-3"
                  style={{ fontSize: 22 }}
                >
                  {s.title}
                </h3>
                <p className="text-[var(--text-2)] text-[16px] leading-[1.8]">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative py-20 border-t border-[var(--border)]">
        <div className="max-w-[860px] mx-auto px-6 sm:px-10 grid sm:grid-cols-2 gap-x-12 gap-y-10 items-start">
          <div>
            <h3
              className="font-[family-name:var(--font-fraunces)] font-medium text-[var(--text-1)] mb-4"
              style={{ fontSize: 20 }}
            >
              Want to tutor on Nyx?
            </h3>
            <p className="text-[var(--text-2)] text-[15px] leading-[1.8] mb-5">
              Cleared the criteria above? Write to us. We pay tutors well, take a small cut, and
              only onboard people we&rsquo;d book ourselves.
            </p>
            <Link
              href="mailto:tutors@nyxscholars.com"
              className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-bright)] text-[12px] font-medium transition-colors group font-mono uppercase tracking-[0.28em]"
            >
              tutors@nyxscholars.com →
            </Link>
          </div>
          <div>
            <h3
              className="font-[family-name:var(--font-fraunces)] font-medium text-[var(--text-1)] mb-4"
              style={{ fontSize: 20 }}
            >
              Want to be tutored?
            </h3>
            <p className="text-[var(--text-2)] text-[15px] leading-[1.8] mb-6">
              Twelve-minute intake matches you to whoever covers your gaps. Free trial after that.
            </p>
            <CTA href="/match" size="default">Get matched</CTA>
          </div>
        </div>
      </section>
    </div>
  );
}
