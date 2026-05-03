/**
 * scripts/seed-srs-baseline.ts
 *
 * Run nightly via the routine + GitHub Action. For every student with
 * zero srs_cards rows, sample 20 BankQuestion items skewed toward their
 * weakest skills (or a global mix if no diagnostic_attempts exist) and
 * stagger due dates so the first 5 come due immediately and the rest
 * spread over the next 7 days.
 *
 * Usage: npx tsx scripts/seed-srs-baseline.ts
 *
 * Env: requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 * Exits cleanly with a logged warning if either is missing.
 */

import { createClient } from "@supabase/supabase-js";
import { POOL } from "../lib/diagnostic";
import type { BankQuestion } from "../lib/diagnostic";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.warn("[seed-srs-baseline] Supabase env not configured — skipping.");
  process.exit(0);
}

const sb = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

interface Student { id: string }

async function main() {
  const { data: students, error: studentErr } = await sb
    .from("profiles")
    .select("id")
    .or("role.eq.student,role.is.null")
    .limit(2000);
  if (studentErr) {
    console.error("[seed-srs-baseline] Could not list students:", studentErr.message);
    process.exit(1);
  }

  let seeded = 0;
  let students_seeded = 0;
  let skipped = 0;

  for (const s of (students ?? []) as Student[]) {
    const { count } = await sb
      .from("srs_cards")
      .select("id", { count: "exact", head: true })
      .eq("user_id", s.id);
    if ((count ?? 0) > 0) {
      skipped += 1;
      continue;
    }

    // Find the student's weakest skills (lowest correct rate).
    const { data: attempts } = await sb
      .from("diagnostic_attempts")
      .select("skill_id, correct")
      .eq("user_id", s.id);
    const skillRates = new Map<string, { right: number; total: number }>();
    for (const a of (attempts ?? []) as { skill_id: string; correct: boolean }[]) {
      const cur = skillRates.get(a.skill_id) ?? { right: 0, total: 0 };
      cur.total += 1;
      if (a.correct) cur.right += 1;
      skillRates.set(a.skill_id, cur);
    }
    const weakSkills = Array.from(skillRates.entries())
      .sort((a, b) => a[1].right / a[1].total - b[1].right / b[1].total)
      .slice(0, 5)
      .map(([id]) => id);

    const cards = pickQueue(weakSkills);
    if (cards.length === 0) continue;

    const now = Date.now();
    const rows = cards.map((card, i) => ({
      user_id:  s.id,
      skill_id: card.skillId,
      prompt:   card.prompt,
      answer:   card.rationale ? `${card.choices[card.correct]} — ${card.rationale}` : card.choices[card.correct],
      due_at:   new Date(now + (i < 5 ? i * 30 * 60 * 1000 : ((i - 5) + 1) * 24 * 60 * 60 * 1000)).toISOString(),
    }));
    const { error } = await sb.from("srs_cards").insert(rows);
    if (error) {
      console.warn(`[seed-srs-baseline] Insert failed for ${s.id}: ${error.message}`);
      continue;
    }
    seeded += rows.length;
    students_seeded += 1;
  }

  console.log(`[seed-srs-baseline] seeded ${seeded} cards for ${students_seeded} students; skipped ${skipped} students who already had cards`);
}

function pickQueue(weakSkills: string[]): BankQuestion[] {
  // Difficulty mix: 3 each from D1-D2, 8 from D3, 5 each from D4-D5.
  const want = { 1: 3, 2: 3, 3: 8, 4: 5, 5: 5 } as Record<number, number>;
  const seen = new Set<string>();
  const picks: BankQuestion[] = [];

  // Prefer weak-skill items first.
  for (const skill of weakSkills) {
    const matched = POOL.filter((q) => q.skillId === skill);
    for (const q of matched) {
      if (picks.length >= 20) break;
      if (seen.has(q.id)) continue;
      const need = want[q.difficulty] ?? 0;
      if (need <= 0) continue;
      picks.push(q);
      seen.add(q.id);
      want[q.difficulty] = need - 1;
    }
  }

  // Top up with any items matching the remaining difficulty quota.
  for (const q of POOL) {
    if (picks.length >= 20) break;
    if (seen.has(q.id)) continue;
    const need = want[q.difficulty] ?? 0;
    if (need <= 0) continue;
    picks.push(q);
    seen.add(q.id);
    want[q.difficulty] = need - 1;
  }
  return picks;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
