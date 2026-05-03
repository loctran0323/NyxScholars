/**
 * Auto-generator pipeline for diagnostic items.
 *
 * Each generator is a pure function (seed → BankQuestion) that produces a
 * deterministic, well-formed item for one skill. The seed lets us produce as
 * many variants as we like without state, while keeping every produced item
 * reproducible (important for grading + debugging).
 *
 * To add a new generator:
 *   1. Implement (seed: number) => BankQuestion below.
 *   2. Register it in `GENERATORS` keyed by `skillId`.
 *   3. The combineBank() call in `index.ts` will mint N variants per skill
 *      automatically, filling skills that the static bank under-covers.
 */

import type { BankQuestion } from "./bank";
import { SKILL_BY_ID } from "./skills";

/* ─── Tiny seeded RNG (LCG) ────────────────────────────────────────────── */
function rng(seed: number): () => number {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pickInt(r: () => number, lo: number, hi: number): number {
  return Math.floor(r() * (hi - lo + 1)) + lo;
}

function shuffle<T>(arr: T[], r: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build a 4-choice question from a numeric correct answer + 3 plausible distractors. */
function withChoices(
  correct: number,
  distractors: number[],
  r: () => number,
  fmt: (n: number) => string = String,
): { choices: string[]; correctIdx: number } {
  const all = shuffle([correct, ...distractors], r).slice(0, 4);
  if (!all.includes(correct)) all[0] = correct;
  const choices = all.map(fmt);
  return { choices, correctIdx: all.indexOf(correct) };
}

function meta(skillId: string) {
  return SKILL_BY_ID[skillId];
}

/* ─── Per-skill generators ─────────────────────────────────────────────── */

/** Linear equations: ax + b = c, integer roots. */
function genLinearEq(seed: number): BankQuestion {
  const r = rng(seed);
  const x = pickInt(r, 2, 9);
  const a = pickInt(r, 2, 9);
  const b = pickInt(r, 1, 12);
  const c = a * x + b;
  const { choices, correctIdx } = withChoices(x, [x + 1, x - 1, x + 2], r);
  const m = meta("lin-eq");
  return {
    id: `gen-lineq-${seed}`,
    skillId: "lin-eq",
    skill: m.name,
    section: "Math",
    difficulty: 2,
    prompt: `If ${a}x + ${b} = ${c}, what is x?`,
    choices,
    correct: correctIdx,
    rationale: `${a}x = ${c - b} → x = ${x}.`,
  };
}

/** Systems: x + y = S, x − y = D. */
function genSystem(seed: number): BankQuestion {
  const r = rng(seed);
  const x = pickInt(r, 3, 12);
  const y = pickInt(r, 1, 9);
  const S = x + y;
  const D = x - y;
  const { choices, correctIdx } = withChoices(x, [y, S, D], r);
  return {
    id: `gen-sys-${seed}`, skillId: "lin-sys",
    skill: meta("lin-sys").name, section: "Math", difficulty: 3,
    prompt: `If x + y = ${S} and x − y = ${D}, what is x?`,
    choices, correct: correctIdx,
    rationale: `Adding gives 2x = ${S + D} → x = ${x}.`,
  };
}

/** Inequality: ax > b. */
function genIneq(seed: number): BankQuestion {
  const r = rng(seed);
  const a = pickInt(r, 2, 6);
  const xMin = pickInt(r, 2, 8);
  const b = a * xMin - 1; // so x > xMin - 1/a, the smallest integer satisfying is xMin (when fractional)
  const ans = xMin; // smallest integer satisfying
  const { choices, correctIdx } = withChoices(
    ans, [ans - 1, ans + 1, ans + 2], r
  );
  return {
    id: `gen-ineq-${seed}`, skillId: "lin-ineq",
    skill: meta("lin-ineq").name, section: "Math", difficulty: 2,
    prompt: `What is the smallest integer x for which ${a}x > ${b}?`,
    choices, correct: correctIdx,
    rationale: `${a}x > ${b} → x > ${(b / a).toFixed(2)} → smallest integer is ${ans}.`,
  };
}

/** Linear function: f(p) = q, f(s) = t → f(u). */
function genLinFn(seed: number): BankQuestion {
  const r = rng(seed);
  const a = pickInt(r, 2, 5);
  const b = pickInt(r, -3, 6);
  const p = pickInt(r, 1, 4);
  const s = p + pickInt(r, 2, 5);
  const u = s + pickInt(r, 3, 8);
  const fp = a * p + b, fs = a * s + b, fu = a * u + b;
  const { choices, correctIdx } = withChoices(
    fu, [fu + a, fu - a, fu + 2 * a], r
  );
  return {
    id: `gen-linfn-${seed}`, skillId: "lin-fn",
    skill: meta("lin-fn").name, section: "Math", difficulty: 3,
    prompt: `f(x) = ax + b. f(${p}) = ${fp} and f(${s}) = ${fs}. What is f(${u})?`,
    choices, correct: correctIdx,
    rationale: `Slope a = ${a}; b = ${b}; f(${u}) = ${fu}.`,
  };
}

/** Absolute value: |x − k| = m → smallest solution. */
function genAbsVal(seed: number): BankQuestion {
  const r = rng(seed);
  const k = pickInt(r, 2, 9);
  const m = pickInt(r, 2, 8);
  const small = k - m;
  const { choices, correctIdx } = withChoices(
    small, [k + m, k - m + 1, k - m - 1], r
  );
  return {
    id: `gen-abs-${seed}`, skillId: "abs-val",
    skill: meta("abs-val").name, section: "Math", difficulty: 2,
    prompt: `What is the smaller solution of |x − ${k}| = ${m}?`,
    choices, correct: correctIdx,
    rationale: `x − ${k} = ±${m} → x = ${k - m} or ${k + m}; smaller is ${k - m}.`,
  };
}

/** Quadratics: x² − bx + c = 0, integer roots. */
function genQuadratic(seed: number): BankQuestion {
  const r = rng(seed);
  const r1 = pickInt(r, 1, 6);
  const r2 = pickInt(r, 2, 7);
  const b = r1 + r2;
  const c = r1 * r2;
  const ans = r1 < r2 ? r1 : r2;
  const { choices, correctIdx } = withChoices(
    ans, [ans + 1, b - ans, c], r
  );
  return {
    id: `gen-quad-${seed}`, skillId: "quad",
    skill: meta("quad").name, section: "Math", difficulty: 3,
    prompt: `What is the smaller solution of x² − ${b}x + ${c} = 0?`,
    choices, correct: correctIdx,
    rationale: `Factors as (x − ${r1})(x − ${r2}) = 0; smaller root is ${ans}.`,
  };
}

/** Exponentials: 2^x = N. */
function genExponential(seed: number): BankQuestion {
  const r = rng(seed);
  const x = pickInt(r, 3, 7);
  const n = 2 ** x;
  const { choices, correctIdx } = withChoices(
    x, [x + 1, x - 1, x + 2], r
  );
  return {
    id: `gen-exp-${seed}`, skillId: "exp",
    skill: meta("exp").name, section: "Math", difficulty: 3,
    prompt: `If 2^x = ${n}, what is x?`,
    choices, correct: correctIdx,
    rationale: `2^${x} = ${n}.`,
  };
}

/** Rates: distance / time. */
function genRate(seed: number): BankQuestion {
  const r = rng(seed);
  const rate = pickInt(r, 4, 12);
  const time = pickInt(r, 3, 9);
  const dist = rate * time;
  const { choices, correctIdx } = withChoices(
    dist, [dist + rate, dist - rate, dist + time], r,
    (n) => `${n} mi`
  );
  return {
    id: `gen-rate-${seed}`, skillId: "fulcrum",
    skill: meta("fulcrum").name, section: "Math", difficulty: 2,
    prompt: `A cyclist rides at ${rate} mph for ${time} hours. How far does she travel?`,
    choices, correct: correctIdx,
    rationale: `${rate} · ${time} = ${dist} mi.`,
  };
}

/** Percentages: percent of base. */
function genPercent(seed: number): BankQuestion {
  const r = rng(seed);
  const base = pickInt(r, 2, 12) * 10;     // 20..120
  const pct = pickInt(r, 1, 9) * 10;       // 10..90
  const ans = (base * pct) / 100;
  const { choices, correctIdx } = withChoices(
    ans, [ans + 5, ans - 5, base - ans], r
  );
  return {
    id: `gen-pct-${seed}`, skillId: "beam-l",
    skill: meta("beam-l").name, section: "Math", difficulty: 2,
    prompt: `What is ${pct}% of ${base}?`,
    choices, correct: correctIdx,
    rationale: `${pct}% · ${base} = ${ans}.`,
  };
}

/** Statistics: mean of a small set. */
function genMean(seed: number): BankQuestion {
  const r = rng(seed);
  const xs = Array.from({ length: 5 }, () => pickInt(r, 2, 20));
  const sum = xs.reduce((a, b) => a + b, 0);
  const mean = sum / xs.length;
  const { choices, correctIdx } = withChoices(
    mean, [mean + 1, mean - 1, sum / 4], r,
    (n) => n % 1 === 0 ? `${n}` : n.toFixed(1)
  );
  return {
    id: `gen-mean-${seed}`, skillId: "beam-r",
    skill: meta("beam-r").name, section: "Math", difficulty: 3,
    prompt: `What is the mean of {${xs.join(", ")}}?`,
    choices, correct: correctIdx,
    rationale: `Sum = ${sum}; mean = ${sum}/${xs.length} = ${mean}.`,
  };
}

/** Probability: red marbles in a bag. */
function genProb(seed: number): BankQuestion {
  const r = rng(seed);
  const red = pickInt(r, 2, 7);
  const blue = pickInt(r, 3, 9);
  const total = red + blue;
  const ans = `${red}/${total}`;
  const choices = shuffle([ans, `${blue}/${total}`, `${red}/${blue}`, `${blue}/${red}`], r);
  return {
    id: `gen-prob-${seed}`, skillId: "pan-l",
    skill: meta("pan-l").name, section: "Math", difficulty: 2,
    prompt: `A bag has ${red} red marbles and ${blue} blue marbles. What is the probability a randomly chosen marble is red?`,
    choices, correct: choices.indexOf(ans),
    rationale: `${red} red of ${total} total.`,
  };
}

/** Pythagorean. */
function genPyth(seed: number): BankQuestion {
  const r = rng(seed);
  const triples: [number, number, number][] = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 40, 41]];
  const [a, b, c] = triples[pickInt(r, 0, triples.length - 1)];
  const k = pickInt(r, 1, 3);
  const A = a * k, B = b * k, C = c * k;
  const { choices, correctIdx } = withChoices(
    C, [C + 1, C - 1, A + B], r
  );
  return {
    id: `gen-pyth-${seed}`, skillId: "b-l",
    skill: meta("b-l").name, section: "Math", difficulty: 3,
    prompt: `A right triangle has legs ${A} and ${B}. What is the hypotenuse?`,
    choices, correct: correctIdx,
    rationale: `√(${A}² + ${B}²) = √${A * A + B * B} = ${C}.`,
  };
}

/** Reading: vocabulary blank, simple template. */
function genVocab(seed: number): BankQuestion {
  const r = rng(seed);
  const items = [
    { sentence: "Despite his ___ manner, the chairman was remarkably forceful.", correct: "diffident",
      distractors: ["mercurial", "ostentatious", "vindictive"] },
    { sentence: "The proposal, though earnest, was ultimately ___.", correct: "ineffectual",
      distractors: ["pernicious", "innocuous", "magnanimous"] },
    { sentence: "Her arguments were so ___ that even skeptics conceded.", correct: "compelling",
      distractors: ["meandering", "trivial", "inscrutable"] },
    { sentence: "The new manager's ___ approach won over the team.", correct: "pragmatic",
      distractors: ["dogmatic", "florid", "capricious"] },
    { sentence: "The witness's account was notable for its ___ detail.", correct: "scrupulous",
      distractors: ["scurrilous", "spurious", "saccharine"] },
  ];
  const item = items[seed % items.length];
  const choices = shuffle([item.correct, ...item.distractors], r);
  return {
    id: `gen-vocab-${seed}`, skillId: "wing-l",
    skill: meta("wing-l").name, section: "Reading & Writing", difficulty: 3,
    prompt: `Which word best completes the sentence?\n\n"${item.sentence}"`,
    choices, correct: choices.indexOf(item.correct),
  };
}

/** Subject–verb agreement. */
function genAgreement(seed: number): BankQuestion {
  const r = rng(seed);
  const items = [
    { stem: "Each of the students ___ submitted a draft.", correct: "has", distractors: ["have", "having", "had been"] },
    { stem: "The list of recommended books ___ posted online.", correct: "is", distractors: ["are", "be", "being"] },
    { stem: "Neither the manager nor the employees ___ aware.", correct: "were", distractors: ["was", "is", "has been"] },
    { stem: "One of the boxes ___ been opened.", correct: "has", distractors: ["have", "having", "are"] },
  ];
  const item = items[seed % items.length];
  const choices = shuffle([item.correct, ...item.distractors], r);
  return {
    id: `gen-agree-${seed}`, skillId: "tip",
    skill: meta("tip").name, section: "Reading & Writing", difficulty: 2,
    prompt: `Which choice conforms to Standard English conventions?\n\n"${item.stem}"`,
    choices, correct: choices.indexOf(item.correct),
  };
}

/** Transitions. */
function genTransition(seed: number): BankQuestion {
  const r = rng(seed);
  const items = [
    { stem: "The bridge would shorten commutes for thousands. ___, environmental review may delay it for years.",
      correct: "However", distractors: ["Therefore", "Indeed", "For instance"] },
    { stem: "Demand has tripled in two years. ___, the company is opening a second plant.",
      correct: "Therefore", distractors: ["Nevertheless", "By contrast", "Meanwhile"] },
    { stem: "Most species recovered after the burn. ___, native grasses returned within one season.",
      correct: "Notably", distractors: ["Conversely", "Hence", "Although"] },
  ];
  const item = items[seed % items.length];
  const choices = shuffle([item.correct, ...item.distractors], r);
  return {
    id: `gen-trans-${seed}`, skillId: "shaft2",
    skill: meta("shaft2").name, section: "Reading & Writing", difficulty: 3,
    prompt: `Which transition best completes the sentence?\n\n"${item.stem}"`,
    choices, correct: choices.indexOf(item.correct),
  };
}

/** Punctuation: comma splice fixes. */
function genPunct(seed: number): BankQuestion {
  const r = rng(seed);
  const items = [
    { stem: "The lab finished its testing, the results were sent to the editor.",
      correct: "testing; the results", distractors: ["testing the results", "testing, and, the results", "testing the results,"] },
    { stem: "We arrived early, the line had already formed.",
      correct: "early; the line", distractors: ["early the line", "early, and, the line", "early. The line had already formed."] },
  ];
  const item = items[seed % items.length];
  const choices = shuffle([item.correct, ...item.distractors], r);
  return {
    id: `gen-punct-${seed}`, skillId: "shaft1",
    skill: meta("shaft1").name, section: "Reading & Writing", difficulty: 3,
    prompt: `Which choice best fixes the comma splice?\n\n"${item.stem}"`,
    choices, correct: choices.indexOf(item.correct),
  };
}

/** Inference template. */
function genInference(seed: number): BankQuestion {
  const r = rng(seed);
  const items = [
    {
      passage: "By the time the second envelope arrived, Mira had already learned to recognize the careful, slanted handwriting on the front.",
      correct: "Mira had received earlier letters from the same person.",
      distractors: [
        "Mira disliked the contents of the letter.",
        "The letter was unwelcome.",
        "Mira lived alone.",
      ],
    },
    {
      passage: "The trail had been worn smooth, though the trail map insisted no one came this way.",
      correct: "Visitors do come this way despite the map.",
      distractors: [
        "The map was created last year.",
        "The trail is dangerous.",
        "Wild animals made the trail.",
      ],
    },
  ];
  const item = items[seed % items.length];
  const choices = shuffle([item.correct, ...item.distractors], r);
  return {
    id: `gen-inf-${seed}`, skillId: "eye-r",
    skill: meta("eye-r").name, section: "Reading & Writing", difficulty: 3,
    prompt: `"${item.passage}"\n\nWhich inference is best supported?`,
    choices, correct: choices.indexOf(item.correct),
  };
}

/* ─── Registry ─────────────────────────────────────────────────────────── */

export type Generator = (seed: number) => BankQuestion;

export const GENERATORS: Record<string, Generator> = {
  "lin-eq":   genLinearEq,
  "lin-sys":  genSystem,
  "lin-ineq": genIneq,
  "lin-fn":   genLinFn,
  "abs-val":  genAbsVal,
  "quad":     genQuadratic,
  "exp":      genExponential,
  "fulcrum":  genRate,
  "beam-l":   genPercent,
  "beam-r":   genMean,
  "pan-l":    genProb,
  "b-l":      genPyth,
  "wing-l":   genVocab,
  "tip":      genAgreement,
  "shaft1":   genPunct,
  "shaft2":   genTransition,
  "eye-r":    genInference,
};

/** Mint `count` deterministic items for `skillId` if a generator exists. */
export function mint(skillId: string, count: number, baseSeed = 1): BankQuestion[] {
  const g = GENERATORS[skillId];
  if (!g) return [];
  const out: BankQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const q = g(baseSeed + i * 17);
    out.push({ ...q, origin: "generated" });
  }
  return out;
}
