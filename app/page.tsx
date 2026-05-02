"use client";

import { motion, type Variants } from "framer-motion";
import {
  Section, Eyebrow, Heading, Text, CTA, Card, StatBlock, HeroFrame,
  PhotoFrame, PlotEmbed, Eyelet, HorizonDivider,
} from "@/components/system";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stats = [
  { stat: "Adaptive", label: "Calibrated by IRT", mono: false },
  { stat: "1,600", label: "SAT score ceiling", mono: true },
  { stat: "Ivy-tier", label: "Authors and tutors", mono: false },
  { stat: "Free", label: "Diagnostic test", mono: false },
];

const principles = [
  { eyelet: "01", title: "Diagnose first.", body: "30-question adaptive diagnostic converges on a section score in under 40 minutes — no guessing what to study." },
  { eyelet: "02", title: "Practice the gaps.", body: "Every session targets the skills at the edge of your ability, not the ones you've already mastered." },
  { eyelet: "03", title: "See the trajectory.", body: "Score curves, mastery heatmaps, and time-to-target estimates — calibrated, not vibes." },
];

export default function HomePage() {
  return (
    <>
      <Section spacing="loose" glow="top" className="pt-[120px] md:pt-[140px]" id="hero">
        <HeroFrame
          eyebrow={<Eyebrow color="brass">Adaptive SAT prep · Calibrated by Ivy-tier students</Eyebrow>}
          heading={
            <Heading level={1}>
              The SAT, mapped to <span className="text-gradient">your</span> gaps.
            </Heading>
          }
          lead={
            <Text variant="lead">
              Nyx is an adaptive preparation system that learns where you struggle, hands you the
              exact questions that grow your score, and shows you the trajectory in real time.
            </Text>
          }
          ctas={
            <>
              <CTA href="/apply" size="lg">Take the free diagnostic</CTA>
              <CTA href="/services" variant="ghost" size="lg" trailingIcon={false}>How it works</CTA>
            </>
          }
          trust={<StatBlock items={stats} columns={4} />}
        />
      </Section>

      <Section variant="elevated" spacing="default" bordered>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
            custom={0} variants={fadeUp}
            className="lg:col-span-6"
          >
            <Eyebrow color="brass" className="mb-5">Manifesto</Eyebrow>
            <Heading level={2} className="mb-6">
              Generic prep is recycled noise.
            </Heading>
            <Text variant="body" className="mb-5">
              Most test prep is the same questions in a new wrapper, sold by tutors who took the
              SAT a decade ago. The exam has changed. The bar has changed. The prep hasn&apos;t.
            </Text>
            <Text variant="body" className="mb-8">
              Nyx is built around one idea: the fastest way to a higher score is the question
              you can&apos;t quite answer yet — delivered at the moment you&apos;re ready for it.
            </Text>
            <CTA href="/sat-act" variant="ghost">Read the approach</CTA>
          </motion.div>
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
            custom={1} variants={fadeUp}
            className="lg:col-span-6"
          >
            <PhotoFrame
              src="/design/manifesto.jpg"
              alt="Late-night study scene"
              aspect="portrait"
              caption="Manifesto"
              index="01"
              mask="bottom"
            />
          </motion.div>
        </div>
      </Section>

      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <Eyelet index="02" label="Trajectory" />
            <Heading level={2} className="mt-5 mb-6">
              You&apos;ll see your score move.
            </Heading>
            <Text variant="body" className="mb-6">
              Every session updates a calibrated estimate of your ability. The trajectory plot
              shows you the path — and the time-to-target — without speculation.
            </Text>
            <ul className="space-y-3">
              {principles.map((p) => (
                <li key={p.eyelet} className="flex gap-4">
                  <span className="font-mono text-[var(--accent)] text-[12px] tracking-[0.18em] pt-1">{p.eyelet}</span>
                  <span>
                    <span className="block text-[var(--text-1)] font-semibold mb-1">{p.title}</span>
                    <span className="block text-[var(--text-2)] text-[14px] leading-relaxed">{p.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <PlotEmbed
              caption="Score trajectory · sample student"
              index="02"
              source="Nyx adaptive engine"
              aspect="landscape"
            />
          </div>
        </div>
      </Section>

      <Section variant="elevated" spacing="default" bordered>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <Eyebrow color="moon" className="mb-4">The Founders</Eyebrow>
            <Heading level={2}>Built by students who just did it.</Heading>
          </div>
          <CTA href="/tutors" variant="ghost" trailingIcon>Meet the founders</CTA>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: "Loc", school: "Princeton, Class of 2028", img: "/design/founder-loc.jpg" },
            { name: "Charles", school: "Princeton, Class of 2028", img: "/design/founder-charles.jpg" },
          ].map((f) => (
            <Card key={f.name} variant="feature" hover>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <PhotoFrame src={f.img} alt={f.name} aspect="square" className="sm:col-span-1" />
                <div className="sm:col-span-2">
                  <Heading level={3} className="mb-2">{f.name}</Heading>
                  <Text variant="small" className="mb-4">{f.school}</Text>
                  <Text variant="small">
                    Authored and calibrated questions for the Nyx bank. Mentors students one-on-one
                    in addition to platform sessions.
                  </Text>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <HorizonDivider />

      <Section variant="accent" spacing="default" glow="bottom">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow color="brass" className="mb-5">Get started</Eyebrow>
          <Heading level={2} className="mb-6">Take the diagnostic. Then decide.</Heading>
          <Text variant="lead" className="mb-10 mx-auto">
            Thirty adaptive questions. Forty minutes. A calibrated score and a real plan — at no cost.
          </Text>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <CTA href="/apply" size="lg">Start the diagnostic</CTA>
            <CTA href="/pricing" variant="ghost" size="lg" trailingIcon={false}>See plans</CTA>
          </div>
          <Text variant="small" className="mt-8 text-[var(--text-3)]">
            Nyx does not guarantee score increases or admissions outcomes.
          </Text>
        </div>
      </Section>
    </>
  );
}
