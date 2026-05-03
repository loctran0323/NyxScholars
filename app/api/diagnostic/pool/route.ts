import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";
import { POOL, type BankQuestion } from "@/lib/diagnostic";

/**
 * GET /api/diagnostic/pool
 *
 * Returns the union of:
 *   • the in-process bank (static + auto-generated, always available)
 *   • any active rows in `diagnostic_questions` (admin-curated)
 *
 * The diagnostic page calls this once at start, then runs the adaptive
 * loop client-side using `lib/diagnostic/adaptive.ts`.
 */
export async function GET() {
  const client = getServiceRoleClient();
  let dbItems: BankQuestion[] = [];

  if (client) {
    const { data } = await client
      .from("diagnostic_questions")
      .select("id, skill_id, skill_name, section, difficulty, prompt, choices, correct_index, rationale, origin")
      .eq("status", "active");
    dbItems = (data ?? []).map((row) => ({
      id: `db-${row.id}`,
      skillId: row.skill_id,
      skill: row.skill_name,
      section: row.section as "Math" | "Reading & Writing",
      difficulty: row.difficulty,
      prompt: row.prompt,
      choices: row.choices as string[],
      correct: row.correct_index,
      rationale: row.rationale ?? undefined,
      origin: row.origin ?? "static",
    }));
  }

  // Merge — db items override duplicates by id (none expected).
  const seen = new Set(POOL.map((q) => q.id));
  for (const q of dbItems) seen.add(q.id);
  const merged = [...POOL, ...dbItems.filter((q) => !POOL.find((p) => p.id === q.id))];

  return NextResponse.json({
    pool: merged,
    counts: {
      total: merged.length,
      static: merged.filter((q) => q.origin === "static").length,
      generated: merged.filter((q) => q.origin === "generated").length,
      database: dbItems.length,
    },
  });
}
