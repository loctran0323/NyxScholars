/**
 * Rich, difficulty-aware math item generators — the infinite-practice backbone.
 *
 * Every generator is a PURE function `(seed, difficulty) => BankQuestion`. Because
 * the answer is computed from the same parameters the prompt is built from, items
 * are correct *by construction* — there is no hand-keyed answer to get wrong. The
 * seed makes every item reproducible; difficulty (1–5) scales the numbers and,
 * for several skills, switches between sub-templates. Together that yields an
 * unbounded supply of genuinely distinct, always-correct SAT-style questions.
 *
 * This module is the difficulty-targeting successor to `lib/diagnostic/generators.ts`
 * (which the diagnostic still uses to top up its static bank). The infinite engine
 * imports from here so it can ask for "a `quad` item at difficulty 4" and get one.
 */

import type { BankQuestion } from "@/lib/diagnostic/bank";
import { SKILL_BY_ID } from "@/lib/diagnostic/skills";

export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type RichGenerator = (seed: number, difficulty: Difficulty) => BankQuestion;

/* ─── Seeded RNG (LCG) ─────────────────────────────────────────────────── */

function rng(seed: number): () => number {
  // Mix the seed so adjacent seeds diverge quickly.
  let s = (Math.abs(Math.floor(seed)) * 2654435761 + 1013904223) % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483647;
    return s / 2147483647;
  };
}

function pint(r: () => number, lo: number, hi: number): number {
  return Math.floor(r() * (hi - lo + 1)) + lo;
}

function pick<T>(r: () => number, arr: readonly T[]): T {
  return arr[Math.floor(r() * arr.length)];
}

function nonzero(r: () => number, lo: number, hi: number): number {
  let v = 0;
  for (let i = 0; i < 12 && v === 0; i++) v = pint(r, lo, hi);
  return v || 1;
}

function shuffle<T>(arr: T[], r: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clampDiff(d: number): Difficulty {
  return Math.max(1, Math.min(5, Math.round(d))) as Difficulty;
}

/* ─── Clean number rendering (Unicode minus, no float noise, tidy terms) ── */

const MINUS = "−";

/** Strip floating-point noise (e.g. 195.49999999999997 → 195.5) and normalize −0. */
function clean(n: number): number {
  const r = Math.round(n * 1e6) / 1e6;
  return Object.is(r, -0) ? 0 : r;
}

/** Number → string with a typographic minus sign. */
function ns(n: number): string {
  const c = clean(n);
  return c < 0 ? `${MINUS}${Math.abs(c)}` : `${c}`;
}

/** Currency, rounded to cents, no trailing .00. */
function money(n: number): string {
  const c = Math.round(n * 100) / 100;
  return c % 1 === 0 ? `$${c}` : `$${c.toFixed(2)}`;
}

/** Leading term of an expression: 1·x → "x", −1·x → "−x", 0 → "". */
function leadTerm(coef: number, v: string): string {
  const c = clean(coef);
  if (c === 0) return "";
  const sign = c < 0 ? MINUS : "";
  const mag = Math.abs(c);
  return `${sign}${mag === 1 && v ? "" : mag}${v}`;
}

/** A following term with its own sign: " + 3x", " − 4", omitted when 0. */
function addTerm(coef: number, v: string): string {
  const c = clean(coef);
  if (c === 0) return "";
  const sign = c < 0 ? ` ${MINUS} ` : " + ";
  const mag = Math.abs(c);
  return `${sign}${mag === 1 && v ? "" : mag}${v}`;
}

/** ax² + bx + c, tidily. */
function quadExpr(a: number, b: number, c: number): string {
  return `${leadTerm(a, "x²")}${addTerm(b, "x")}${addTerm(c, "")}`.trim() || "0";
}

/** ax + b, tidily. */
function linExpr(a: number, b: number): string {
  return `${leadTerm(a, "x")}${addTerm(b, "")}`.trim() || "0";
}

/** ax + by, tidily (two variables, no constant). */
function twoVar(a: number, b: number): string {
  return `${leadTerm(a, "x")}${addTerm(b, "y")}`.trim() || "0";
}

/**
 * Build exactly four distinct choices from a correct value plus a pool of
 * distractor candidates, padding with synthesized near-misses if the pool is
 * thin. Guarantees: 4 entries, all distinct (case-insensitive), the correct
 * one present, key letter varied by the shuffle.
 */
function choices4(
  correct: number | string,
  distractorPool: Array<number | string>,
  r: () => number,
  fmt: (n: number | string) => string = (n) => (typeof n === "number" ? ns(n) : String(n)),
): { choices: string[]; correct: number } {
  const fc = fmt(correct);
  const out: string[] = [fc];
  const seen = new Set([fc.toLowerCase()]);

  for (const d of shuffle(distractorPool, r)) {
    if (out.length >= 4) break;
    const fd = fmt(d);
    const k = fd.toLowerCase();
    if (!seen.has(k) && fd.trim().length > 0) {
      seen.add(k);
      out.push(fd);
    }
  }
  // Pad with synthesized near-misses for numeric answers.
  let bump = 1;
  while (out.length < 4) {
    const base = typeof correct === "number" ? correct : Number(correct);
    const cand = Number.isFinite(base) ? fmt(base + bump * (r() < 0.5 ? 1 : -1)) : `${fc}${" ".repeat(out.length)}`;
    const k = cand.toLowerCase();
    if (!seen.has(k) && cand.trim().length > 0) {
      seen.add(k);
      out.push(cand);
    }
    bump++;
    if (bump > 40) {
      // Absolute fallback — should never trigger for well-formed inputs.
      out.push(`${fc} (alt ${out.length})`);
    }
  }
  const shuffled = shuffle(out, r);
  return { choices: shuffled, correct: shuffled.indexOf(fc) };
}

/**
 * Assemble exactly four distinct string choices from a correct answer plus a
 * pool of candidate distractors. Dedups case-insensitively; the candidate pool
 * must be rich enough (≥3 survivors) so the visible-fallback pad never fires.
 */
function strChoices(
  correct: string,
  candidates: string[],
  r: () => number,
): { choices: string[]; correct: number } {
  const seen = new Set([correct.trim().toLowerCase()]);
  const out = [correct];
  for (const c of candidates) {
    if (out.length >= 4) break;
    const k = c.trim().toLowerCase();
    if (c.trim() && !seen.has(k)) {
      seen.add(k);
      out.push(c);
    }
  }
  let n = 2;
  while (out.length < 4) {
    const c = `${correct} (×${n})`;
    if (!seen.has(c.toLowerCase())) {
      seen.add(c.toLowerCase());
      out.push(c);
    }
    n++;
    if (n > 30) break;
  }
  const sh = shuffle(out, r);
  return { choices: sh, correct: sh.indexOf(correct) };
}

function name(skillId: string): string {
  return SKILL_BY_ID[skillId]?.name ?? skillId;
}

function base(skillId: string, seed: number, difficulty: Difficulty): Pick<BankQuestion, "id" | "skillId" | "skill" | "section" | "difficulty" | "origin"> {
  return {
    id: `gx-${skillId}-${difficulty}-${seed}`,
    skillId,
    skill: name(skillId),
    section: "Math",
    difficulty,
    origin: "generated",
  };
}

/* ─── Algebra ──────────────────────────────────────────────────────────── */

/** Linear equations — ax + b = c, two-step, or distributed. */
const genLinearEq: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  const x = pint(r, 2, 4 + d * 3);
  if (d <= 2) {
    const a = pint(r, 2, 9), b = pint(r, 1, 12);
    const c = a * x + b;
    const { choices, correct } = choices4(x, [x + 1, x - 1, x + 2, c - b], r);
    return { ...base("lin-eq", seed, d), prompt: `If ${a}x + ${b} = ${c}, what is the value of x?`, choices, correct,
      rationale: `${a}x = ${c} − ${b} = ${c - b}, so x = ${x}.` };
  }
  if (d === 3) {
    const a = pint(r, 3, 8), e = pint(r, 1, 2), b = pint(r, 2, 9);
    const rhs = (a - e) * x + b;
    const { choices, correct } = choices4(x, [x + 1, x - 1, x + 2, -x], r);
    return { ...base("lin-eq", seed, d), prompt: `If ${a}x + ${b} = ${e === 1 ? "" : e}x + ${ns(rhs)}, what is the value of x?`, choices, correct,
      rationale: `(${a} − ${e})x = ${ns(rhs)} − ${b} → ${a - e}x = ${ns(rhs - b)} → x = ${ns(x)}.` };
  }
  // d >= 4: distribute
  const k = pint(r, 2, 6), m = pint(r, 1, 7), p = pint(r, 1, 9);
  const inner = x - m;
  const c = k * inner + p;
  const { choices, correct } = choices4(x, [x + 1, x - 1, m, c], r);
  return { ...base("lin-eq", seed, d), prompt: `If ${k}(x − ${m}) + ${p} = ${ns(c)}, what is the value of x?`, choices, correct,
    rationale: `${k}(x − ${m}) = ${ns(c - p)} → x − ${m} = ${ns(inner)} → x = ${ns(x)}.` };
};

/** Systems of equations. */
const genSystem: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  const x = pint(r, 2, 6 + d), y = pint(r, 1, 5 + d);
  if (d <= 3) {
    const S = x + y, D = x - y;
    const ask = pick(r, ["x", "y"] as const);
    const ans = ask === "x" ? x : y;
    const { choices, correct } = choices4(ans, [x, y, S, D, ans + 1, ans - 1], r);
    return { ...base("lin-sys", seed, d), prompt: `If x + y = ${ns(S)} and x − y = ${ns(D)}, what is the value of ${ask}?`, choices, correct,
      rationale: `Adding the equations: 2x = ${ns(S + D)} → x = ${x}, y = ${y}.` };
  }
  // general 2x2 with coefficients
  const a = nonzero(r, 2, 5), b = nonzero(r, 1, 4), c = nonzero(r, 1, 5), e = nonzero(r, 2, 6);
  const m = a * x + b * y, n = c * x + e * y;
  const askVar = pick(r, ["x", "y"] as const);
  const ans = askVar === "x" ? x : y;
  const { choices, correct } = choices4(ans, [x, y, ans + 1, ans - 1, ans + 2], r);
  return { ...base("lin-sys", seed, d), prompt: `If ${twoVar(a, b)} = ${ns(m)} and ${twoVar(c, e)} = ${ns(n)}, what is the value of ${askVar}?`, choices, correct,
    rationale: `Solving the system gives x = ${x}, y = ${y}.` };
};

/** Linear inequalities — smallest/largest integer solution. */
const genIneq: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  const a = pint(r, 2, 3 + d), xMin = pint(r, 2, 6 + d);
  const b = a * xMin - 1; // x > (a·xMin − 1)/a ⇒ smallest integer is xMin
  const flip = d >= 4 && r() < 0.5;
  if (flip) {
    // −a x < b form (division by negative flips)
    const ans = xMin;
    const { choices, correct } = choices4(ans, [ans - 1, ans + 1, ans + 2, -ans], r);
    return { ...base("lin-ineq", seed, d), prompt: `What is the smallest integer x for which −${a}x < ${ns(-b)}?`, choices, correct,
      rationale: `Divide both sides by −${a} and flip the inequality: x > ${(b / a).toFixed(2)}, so the smallest integer is ${ans}.` };
  }
  const ans = xMin;
  const { choices, correct } = choices4(ans, [ans - 1, ans + 1, ans + 2, a], r);
  return { ...base("lin-ineq", seed, d), prompt: `What is the smallest integer x for which ${a}x > ${b}?`, choices, correct,
    rationale: `x > ${b}/${a} = ${(b / a).toFixed(2)}, so the smallest integer is ${ans}.` };
};

/** Linear functions — evaluate / slope from two points. */
const genLinFn: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  const a = nonzero(r, -3 - d, 5 + d), b = pint(r, -4, 8);
  const p = pint(r, 1, 4), s = p + pint(r, 2, 4 + d), u = s + pint(r, 2, 5 + d);
  const fp = a * p + b, fs = a * s + b, fu = a * u + b;
  if (d >= 4) {
    // ask for slope
    const { choices, correct } = choices4(a, [a + 1, a - 1, b, -a], r);
    return { ...base("lin-fn", seed, d), prompt: `A linear function f satisfies f(${p}) = ${ns(fp)} and f(${s}) = ${ns(fs)}. What is the slope of f?`, choices, correct,
      rationale: `slope = (${ns(fs)} − ${ns(fp)}) / (${s} − ${p}) = ${ns(fs - fp)}/${s - p} = ${ns(a)}.` };
  }
  const { choices, correct } = choices4(fu, [fu + a, fu - a, fu + 2, fp], r);
  return { ...base("lin-fn", seed, d), prompt: `A linear function f satisfies f(${p}) = ${ns(fp)} and f(${s}) = ${ns(fs)}. What is the value of f(${u})?`, choices, correct,
    rationale: `f(x) = ${linExpr(a, b)}; f(${u}) = ${ns(fu)}.` };
};

/** Absolute value equations. */
const genAbsVal: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  const k = pint(r, 2, 6 + d), m = pint(r, 2, 5 + d);
  if (d >= 4) {
    // |ax − kk| = m form, kk chosen as a multiple of a
    const a = pint(r, 2, 4);
    const kk = a * pint(r, 2, 6), small2 = (kk - m) / a, large2 = (kk + m) / a;
    const ans = Math.min(small2, large2);
    const fmt = (n: number | string) => (typeof n === "number" && n % 1 !== 0 ? Number(n).toFixed(2) : ns(Number(n)));
    const { choices, correct } = choices4(ans, [Math.max(small2, large2), ans + 1, ans - 1, kk / a], r, fmt);
    return { ...base("abs-val", seed, d), prompt: `What is the smaller solution of |${a}x − ${kk}| = ${m}?`, choices, correct,
      rationale: `${a}x − ${kk} = ±${m} → x = ${fmt(small2)} or ${fmt(large2)}; smaller is ${fmt(ans)}.` };
  }
  const small = k - m;
  const { choices, correct } = choices4(small, [k + m, k - m + 1, k - m - 1, m], r);
  return { ...base("abs-val", seed, d), prompt: `What is the smaller solution of |x − ${k}| = ${m}?`, choices, correct,
    rationale: `x − ${k} = ±${m} → x = ${ns(k - m)} or ${ns(k + m)}; the smaller is ${ns(k - m)}.` };
};

/* ─── Advanced Math ────────────────────────────────────────────────────── */

/** Quadratics — roots, vertex, or sum/product. */
const genQuadratic: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  const r1 = pint(r, 1, 4 + d), r2 = pint(r, 1, 5 + d);
  const b = r1 + r2, c = r1 * r2;
  if (d >= 4 && r() < 0.5) {
    // sum of roots for x² − bx + c
    const sum = b; // roots of x² − bx + c sum to b
    const { choices, correct } = choices4(sum, [b - 1, b + 1, c, -b], r);
    return { ...base("quad", seed, d), prompt: `The solutions to x² − ${b}x + ${c} = 0 are p and q. What is p + q?`, choices, correct,
      rationale: `For x² − ${b}x + ${c}, the sum of roots is ${b} (−b/a).` };
  }
  const ans = Math.min(r1, r2);
  const { choices, correct } = choices4(ans, [Math.max(r1, r2), ans + 1, b - ans, c], r);
  return { ...base("quad", seed, d), prompt: `What is the smaller solution of x² − ${b}x + ${c} = 0?`, choices, correct,
    rationale: `Factors as (x − ${r1})(x − ${r2}) = 0; the smaller root is ${ans}.` };
};

/** Polynomials — evaluate, remainder/factor theorem. */
const genPoly: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  const a = nonzero(r, 1, 3), b = nonzero(r, -4, 4), c = pint(r, -5, 6);
  const k = pint(r, 1, 2 + d);
  const val = a * k * k + b * k + c;
  const expr = quadExpr(a, b, c);
  if (d >= 4) {
    // remainder theorem: remainder of p(x) ÷ (x − k) is p(k)
    const { choices, correct } = choices4(val, [val + 1, val - 1, val + k, -val], r);
    return { ...base("poly", seed, d), prompt: `When p(x) = ${expr} is divided by (x − ${k}), what is the remainder?`, choices, correct,
      rationale: `By the Remainder Theorem, the remainder is p(${k}) = ${ns(val)}.` };
  }
  const { choices, correct } = choices4(val, [val + 2, val - 2, val + k, a + b + c], r);
  return { ...base("poly", seed, d), prompt: `If p(x) = ${expr}, what is the value of p(${k})?`, choices, correct,
    rationale: `Substitute x = ${k}: p(${k}) = ${ns(val)}.` };
};

/** Exponentials — solve 2^x = N, or growth. */
const genExp: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  if (d >= 4) {
    // exponential growth model
    const a = pint(r, 2, 9) * 100, rate = pick(r, [2, 3, 4, 5]), t = pint(r, 2, 4);
    const val = a * Math.pow(rate, t);
    const { choices, correct } = choices4(val, [a * rate * t, a * Math.pow(rate, t - 1), val + a, a * rate], r);
    return { ...base("exp", seed, d), prompt: `A culture starts with ${a} cells and multiplies by ${rate} each hour. How many cells are there after ${t} hours?`, choices, correct,
      rationale: `${a}·${rate}^${t} = ${a}·${Math.pow(rate, t)} = ${val}.` };
  }
  const base2 = pick(r, [2, 3, 5]);
  const x = pint(r, 2, 5);
  const n = Math.pow(base2, x);
  const { choices, correct } = choices4(x, [x + 1, x - 1, x + 2, n], r);
  return { ...base("exp", seed, d), prompt: `If ${base2}^x = ${n}, what is the value of x?`, choices, correct,
    rationale: `${base2}^${x} = ${n}, so x = ${x}.` };
};

/** Rational expressions — solve or simplify-evaluate. */
const genRational: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  const x = pint(r, 2, 6 + d), a = pint(r, 1, 6);
  if (d >= 4) {
    // solve aa/(x−k) = m, with aa chosen divisible by m so x is an integer
    const k = pint(r, 1, 4), m = pint(r, 1, 6);
    const aa = m * pint(r, 1, 4);
    const x2 = k + aa / m;
    const { choices, correct } = choices4(x2, [x2 + 1, x2 - 1, k, m], r);
    return { ...base("rat", seed, d), prompt: `If ${aa}/(x − ${k}) = ${m}, what is the value of x?`, choices, correct,
      rationale: `x − ${k} = ${aa}/${m} = ${aa / m} → x = ${x2}.` };
  }
  const numerator = a * x;
  const { choices, correct } = choices4(x, [a, a + 1, x + 1, x - 1], r);
  return { ...base("rat", seed, d), prompt: `If ${numerator}/x = ${a} and x ≠ 0, what is the value of x?`, choices, correct,
    rationale: `x = ${numerator}/${a} = ${x}.` };
};

/* ─── Problem Solving & Data ───────────────────────────────────────────── */

/** Ratios & rates. */
const genRate: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  if (d >= 4) {
    // unit-rate / unit conversion
    const items = pint(r, 3, 8), cost = items * pint(r, 2, 6);
    const want = items + pint(r, 2, 6);
    const unit = cost / items;
    const ans = unit * want;
    const { choices, correct } = choices4(ans, [ans + unit, ans - unit, cost, want], r, (n) => `$${n}`);
    return { ...base("fulcrum", seed, d), prompt: `${items} identical notebooks cost $${cost}. At the same rate, how much do ${want} notebooks cost?`, choices, correct,
      rationale: `Unit price = $${cost}/${items} = $${unit}; ${want}·$${unit} = $${ans}.` };
  }
  const rate = pint(r, 4, 14), time = pint(r, 2, 9);
  const dist = rate * time;
  const { choices, correct } = choices4(dist, [dist + rate, dist - rate, dist + time, rate + time], r, (n) => `${n} mi`);
  return { ...base("fulcrum", seed, d), prompt: `A cyclist travels at ${rate} miles per hour for ${time} hours. How far does she travel?`, choices, correct,
    rationale: `distance = rate · time = ${rate} · ${time} = ${dist} miles.` };
};

/** Percentages — of, increase/decrease, reverse. */
const genPercent: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  const baseN = pint(r, 2, 12) * 10, pct = pint(r, 1, 9) * 10;
  if (d >= 4) {
    // percent change / reverse percent
    const original = pint(r, 4, 20) * 10, change = pint(r, 1, 4) * 5;
    const increased = clean(original * (1 + change / 100));
    const { choices, correct } = choices4(increased, [
      clean(original * (1 - change / 100)), original + change, increased + 10, original,
    ], r, (n) => money(Number(n)));
    return { ...base("beam-l", seed, d), prompt: `A $${original} annual membership increases in price by ${change}%. What is the new price?`, choices, correct,
      rationale: `${money(original)} · (1 + ${change}/100) = ${money(increased)}.` };
  }
  const ans = (baseN * pct) / 100;
  const { choices, correct } = choices4(ans, [ans + 5, ans - 5, baseN - ans, (baseN * (pct + 10)) / 100], r);
  return { ...base("beam-l", seed, d), prompt: `What is ${pct}% of ${baseN}?`, choices, correct,
    rationale: `${pct}% · ${baseN} = ${ans}.` };
};

/** Statistics — mean, median, or effect of adding a value. */
const genStats: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  const len = d <= 2 ? 5 : pint(r, 5, 7);
  const xs = Array.from({ length: len }, () => pint(r, 2, 10 + d * 3));
  const sum = xs.reduce((a, b) => a + b, 0);
  const mean = sum / len;
  if (d >= 4) {
    const sorted = [...xs].sort((a, b) => a - b);
    const median = len % 2 ? sorted[(len - 1) / 2] : (sorted[len / 2 - 1] + sorted[len / 2]) / 2;
    const fmt = (n: number | string) => (typeof n === "number" && n % 1 !== 0 ? Number(n).toFixed(1) : String(n));
    const { choices, correct } = choices4(median, [mean, median + 1, median - 1, sorted[0]], r, fmt);
    return { ...base("beam-r", seed, d), prompt: `What is the median of the data set {${xs.join(", ")}}?`, choices, correct,
      rationale: `Sorted: ${sorted.join(", ")}; the median is ${fmt(median)}.` };
  }
  const fmt = (n: number | string) => (typeof n === "number" && n % 1 !== 0 ? Number(n).toFixed(1) : String(n));
  const { choices, correct } = choices4(mean, [mean + 1, mean - 1, sum / (len - 1), xs[0]], r, fmt);
  return { ...base("beam-r", seed, d), prompt: `What is the mean (average) of the data set {${xs.join(", ")}}?`, choices, correct,
    rationale: `Sum = ${sum}; mean = ${sum}/${len} = ${fmt(mean)}.` };
};

/** Probability — simple and compound. */
const genProb: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  const red = pint(r, 2, 7);
  let blue = pint(r, 3, 9);
  if (blue === red) blue += 1;
  if (d >= 4) {
    let green = pint(r, 2, 6);
    while (green === red || green === blue) green += 1;
    const total = red + blue + green;
    const favorable = red + green; // P(red or green)
    const ans = `${favorable}/${total}`;
    const { choices, correct } = strChoices(ans, [
      `${red}/${total}`, `${blue}/${total}`, `${green}/${total}`,
      `${favorable}/${red + blue}`, `${blue}/${red}`,
    ], r);
    return { ...base("pan-l", seed, d), prompt: `A jar holds ${red} red, ${blue} blue, and ${green} green marbles. If one marble is drawn at random, what is the probability it is red or green?`, choices, correct,
      rationale: `Favorable outcomes = ${red} + ${green} = ${favorable} out of ${total} total → ${ans}.` };
  }
  const total = red + blue;
  const ans = `${red}/${total}`;
  const { choices, correct } = strChoices(ans, [
    `${blue}/${total}`, `${red}/${blue}`, `${blue}/${red}`, `${red}/${blue + red + 1}`,
  ], r);
  return { ...base("pan-l", seed, d), prompt: `A bag contains ${red} red and ${blue} blue marbles. If one marble is chosen at random, what is the probability it is red?`, choices, correct,
    rationale: `${red} red out of ${total} total → ${ans}.` };
};

/** Data inference — line of best fit / table reads. */
const genDataInf: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  const slope = nonzero(r, 1, 2 + d), intercept = pint(r, -3, 9), x = pint(r, 4, 8 + d * 2);
  const y = slope * x + intercept;
  const expr = linExpr(slope, intercept);
  if (d >= 4) {
    // back-solve x from y
    const yTarget = slope * x + intercept;
    const { choices, correct } = choices4(x, [x + 1, x - 1, yTarget, slope], r);
    return { ...base("pan-r", seed, d), prompt: `A line of best fit is modeled by y = ${expr}. For what value of x does the model predict y = ${ns(yTarget)}?`, choices, correct,
      rationale: `${ns(yTarget)} = ${expr} → x = ${ns(x)}.` };
  }
  const { choices, correct } = choices4(y, [y + slope, y - slope, y + 2, intercept], r);
  return { ...base("pan-r", seed, d), prompt: `A line of best fit is modeled by y = ${expr}. What does the model predict for y when x = ${x}?`, choices, correct,
    rationale: `y = ${slope}·${x}${addTerm(intercept, "")} = ${ns(y)}.` };
};

/* ─── Geometry & Trig ──────────────────────────────────────────────────── */

/** Angles & lines. */
const genAngles: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  if (d >= 4) {
    // triangle angle sum / exterior angle
    const a = pint(r, 30, 70), b = pint(r, 30, 80);
    const c = 180 - a - b;
    const { choices, correct } = choices4(c, [180 - a, a + b, 90 - c, c + 10], r, (n) => `${n}°`);
    return { ...base("apex", seed, d), prompt: `Two angles of a triangle measure ${a}° and ${b}°. What is the measure of the third angle?`, choices, correct,
      rationale: `Angles of a triangle sum to 180°: 180 − ${a} − ${b} = ${c}°.` };
  }
  const a = pint(r, 25, 80);
  const ans = 180 - a;
  const { choices, correct } = choices4(ans, [a, 90 - a, 360 - a, ans - 10], r, (n) => `${n}°`);
  return { ...base("apex", seed, d), prompt: `Two angles are supplementary and one measures ${a}°. What is the measure of the other?`, choices, correct,
    rationale: `Supplementary angles sum to 180°, so the other is ${ans}°.` };
};

/** Triangles — Pythagorean / area. */
const genTriangle: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  const triples: [number, number, number][] = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 40, 41], [20, 21, 29]];
  const [a, b, c] = pick(r, triples);
  const k = d >= 4 ? pint(r, 2, 4) : 1;
  const A = a * k, B = b * k, C = c * k;
  if (d >= 4 && r() < 0.5) {
    const area = (A * B) / 2;
    const { choices, correct } = choices4(area, [A * B, area + A, area - B, A + B], r);
    return { ...base("b-l", seed, d), prompt: `A right triangle has legs ${A} and ${B}. What is its area?`, choices, correct,
      rationale: `Area = ½·${A}·${B} = ${area}.` };
  }
  const { choices, correct } = choices4(C, [C + 1, C - 1, A + B, C + k], r);
  return { ...base("b-l", seed, d), prompt: `A right triangle has legs ${A} and ${B}. What is the length of the hypotenuse?`, choices, correct,
    rationale: `√(${A}² + ${B}²) = √${A * A + B * B} = ${C}.` };
};

/** Circles — circumference, area, arc. */
const genCircle: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  const radius = pint(r, 2, 6 + d);
  if (d >= 4) {
    const area = `${radius * radius}π`;
    const { choices, correct } = strChoices(area, [
      `${2 * radius}π`, `${radius}π`, `${4 * radius}π`, `${3 * radius}π`, `${radius * radius}`,
    ], r);
    return { ...base("b-r", seed, d), prompt: `A circle has radius ${radius}. What is its area?`, choices, correct,
      rationale: `A = πr² = π·${radius}² = ${area}.` };
  }
  const circ = `${2 * radius}π`;
  const { choices, correct } = strChoices(circ, [
    `${radius}π`, `${radius * radius}π`, `${4 * radius}π`, `${3 * radius}π`, `${2 * radius}`,
  ], r);
  return { ...base("b-r", seed, d), prompt: `A circle has radius ${radius}. What is its circumference?`, choices, correct,
    rationale: `C = 2πr = 2π·${radius} = ${circ}.` };
};

/** Trigonometry — special angles, SOH-CAH-TOA. */
const genTrig: RichGenerator = (seed, difficulty) => {
  const r = rng(seed);
  const d = clampDiff(difficulty);
  if (d >= 4) {
    // right-triangle ratio from sides
    const [a, b, c] = pick(r, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]] as [number, number, number][]);
    const fn = pick(r, ["sin", "cos", "tan"] as const);
    const ans = fn === "sin" ? `${a}/${c}` : fn === "cos" ? `${b}/${c}` : `${a}/${b}`;
    const { choices, correct } = strChoices(ans, [
      `${a}/${c}`, `${b}/${c}`, `${a}/${b}`, `${b}/${a}`, `${c}/${a}`, `${c}/${b}`,
    ], r);
    return { ...base("cent", seed, d), prompt: `In a right triangle, the side opposite angle θ has length ${a}, the side adjacent to θ has length ${b}, and the hypotenuse has length ${c}. What is the value of ${fn} θ?`, choices, correct,
      rationale: `${fn} θ = ${fn === "sin" ? "opposite/hypotenuse" : fn === "cos" ? "adjacent/hypotenuse" : "opposite/adjacent"} = ${ans} (SOH-CAH-TOA).` };
  }
  const items = [
    { p: "sin(30°)", a: "1/2", dd: ["√3/2", "1", "√2/2"] },
    { p: "cos(60°)", a: "1/2", dd: ["√3/2", "1", "√2/2"] },
    { p: "tan(45°)", a: "1", dd: ["0", "√3", "√3/3"] },
    { p: "sin(45°)", a: "√2/2", dd: ["1/2", "√3/2", "1"] },
    { p: "cos(30°)", a: "√3/2", dd: ["1/2", "√2/2", "1"] },
    { p: "sin(60°)", a: "√3/2", dd: ["1/2", "√2/2", "1"] },
  ];
  const it = pick(r, items);
  const choices = shuffle([it.a, ...it.dd], r);
  return { ...base("cent", seed, d), prompt: `What is the exact value of ${it.p}?`, choices, correct: choices.indexOf(it.a),
    rationale: `${it.p} = ${it.a} (special-angle value).` };
};

/* ─── Registry ─────────────────────────────────────────────────────────── */

export const RICH_MATH_GENERATORS: Record<string, RichGenerator> = {
  "lin-eq": genLinearEq,
  "lin-sys": genSystem,
  "lin-ineq": genIneq,
  "lin-fn": genLinFn,
  "abs-val": genAbsVal,
  quad: genQuadratic,
  poly: genPoly,
  exp: genExp,
  rat: genRational,
  fulcrum: genRate,
  "beam-l": genPercent,
  "beam-r": genStats,
  "pan-l": genProb,
  "pan-r": genDataInf,
  apex: genAngles,
  "b-l": genTriangle,
  "b-r": genCircle,
  cent: genTrig,
};

export const MATH_SKILL_IDS = Object.keys(RICH_MATH_GENERATORS);

/**
 * Generate one item for a skill at a target difficulty. Returns null if the
 * skill has no rich generator (the caller then falls back to the static pool).
 */
export function generateMathItem(skillId: string, seed: number, difficulty: number): BankQuestion | null {
  const g = RICH_MATH_GENERATORS[skillId];
  if (!g) return null;
  return g(seed, clampDiff(difficulty));
}

/** True when a skill can be generated on demand (i.e. is genuinely infinite). */
export function isGeneratable(skillId: string): boolean {
  return Boolean(RICH_MATH_GENERATORS[skillId]);
}
