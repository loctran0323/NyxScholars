# Arush R&W Practice Portal + Talija Tutor View

**Date:** 2026-05-29
**Context:** Live tutoring call in ~2 hours. Student Arush (already scored 1500) needs hard,
pacing- and content-focused Reading & Writing practice. Tutor Talija needs the answer key,
rationales, his live results, and a homework-assignment tool. Math is out of scope except for
fixing factual answer-key bugs already in the bank.

## Hard constraints (from the user)

1. **Arush sees ONLY the question + answer choices.** Never the correct answer, never a
   rationale, never per-question right/wrong. He is meant to be *tutored*, not to self-grade.
   The answer key is **server-only** so it cannot leak into his browser bundle.
2. **Talija holds everything** — answers, rationales, worked solutions, his synced results.
3. **AI-artifact-free.** Hand-written register. No telltale AI phrasing, no fabricated specific
   references (named scholars, invented studies, suspiciously precise statistics, brand names).
   Sophisticated but self-contained passages. Enforced by an adversarial verification pass.
4. **Deploy-ready** on Vercel; the whole site must build, lint, and pass a bank-integrity test.

## Routes (all new, no Supabase login)

- `/students/[slug]` and `/temp/[slug]` — Arush's portal (`arush` slug). Loads with no auth.
- `/talija` — tutor portal, gated by a passphrase cookie (`TALIJA_PASSCODE`, falls back to
  `ADMIN_PASSWORD`). Mirrors the existing `/admin` gate pattern.

## Student portal

- Landing: greeting + goal banner (1500 → 1550+), two mode cards, plus a "Homework from Talija"
  card when an assignment exists.
- **Pacing mode** — SAT-realistic timed R&W module: 27 questions / 32:00 countdown, per-question
  pace clock (~71s target), flag/skip, review-before-submit, low-time warning, auto-submit at 0:00.
  End screen = pace report (time per question, slow/rushed flags) + completion. **No correctness, no answers.**
- **Content mode** — pick a skill, untimed set, question + choices only. **No explanation shown.**
- All state client-side (cannot break on a flaky network). Picks + timings best-effort POST to
  `/api/temp/[slug]/results`; failure never blocks his flow. Local backup in `localStorage`.

## Tutor portal (`/talija`)

- Tab 1 **Arush's results** — synced sessions: score, pace report, per-skill accuracy, per-question
  (his pick vs. correct, time). Client polls a gated GET endpoint to refresh.
- Tab 2 **Prep / question bank** — full R&W bank by skill/difficulty with answers, rationales,
  worked examples, pacing targets.
- **Assign homework** — choose focus skills (or all) + count, optional note, and a checkbox
  *"also release worked solutions to Arush"* (default off). Writes an assignment Arush's portal reads.

## Data

- `lib/practice/rw-bank.ts` (**`import "server-only"`**) — ~120 hand-authored hard R&W questions
  (difficulty 3–5) across all SAT R&W skills, weighted to the high-yield 1500→1550 skills
  (Inferences, Command of Evidence textual + quantitative, Transitions, Rhetorical Synthesis,
  Boundaries, Words in Context). Each: domain, skill, difficulty, passage (where relevant),
  prompt, 4 choices, correct index, rationale (why right + the trap), optional worked example,
  paceSeconds. Plus per-skill concept/strategy notes and two pre-built 27-question pacing modules.
- A `publicQuestion()` projection strips `correct`/`rationale`/`workedExample` for Arush's client.

## Sync store (`supabase-temp-practice-schema.sql`)

- `temp_practice_results` (slug, mode, module/skill, answers jsonb, totals, duration) — written by
  the results API via the **service-role** client; correctness computed server-side from the bank.
- `temp_homework` (slug, skills, question_ids, include_worked, note) — written by the homework API.
- Service-role RLS only; no auth dependency. The **one manual step** is pasting this SQL into
  Supabase. Missing migration degrades gracefully: Arush's practice still works, `/talija` still
  shows the full bank, sync just shows "no results yet."

## Existing-bank cleanup (`lib/diagnostic/bank.ts`)

Fix factual answer-key bugs: `adv-poly-2` (key 8 → should be 2), `adv-poly-3` (key 4 → 0),
`alg-eq-8` (key 3 → 1), `alg-ineq-5` (duplicate choices), `data-stat-4` (two correct),
`adv-rat-2` (no valid solution). Add rationales to all R&W items missing them.

## Verification / deploy-readiness

- `scripts/validate-rw-bank.ts` — asserts every question has 4 choices, a valid single correct
  index, a non-empty rationale, no all-same-answer pattern, no duplicate prompts, balanced answer
  distribution.
- Multi-agent authoring workflow: per-skill author → per-skill rigorous verify/correct (re-solve
  answer, kill AI tells + fabricated references) → global answer-key + AI-artifact + distribution audit.
- `npm run build` + `npm run lint` clean. Site-wide page audit for crashes/placeholders.
