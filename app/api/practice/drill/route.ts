import { NextRequest, NextResponse } from "next/server";
import { getPortalApi } from "@/lib/portal-auth";
import { getPublishedPool, type DbQuestion } from "@/lib/questions/repo";
import { POOL } from "@/lib/diagnostic";

interface DrillItem {
  id: string;
  skillId: string;
  skill: string;
  section: "Math" | "Reading & Writing";
  difficulty: number;
  prompt: string;
  choices: string[];
  correct: number;
  rationale?: string;
  source: "db" | "static";
}

const DRILL_TARGET = 10;
const STATIC_FALLBACK_THRESHOLD = 6;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function dbToDrill(q: DbQuestion): DrillItem {
  return {
    id: `db-${q.id}`,
    skillId: q.skill_id,
    skill: q.skill_name,
    section: q.section,
    difficulty: q.difficulty,
    prompt: q.prompt,
    choices: q.choices,
    correct: q.correct_index,
    rationale: q.rationale ?? undefined,
    source: "db",
  };
}

export async function GET(req: NextRequest) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const skill = req.nextUrl.searchParams.get("skill");
  if (!skill) {
    return NextResponse.json({ error: "skill query param required" }, { status: 400 });
  }
  const limit = Math.min(20, Math.max(1, Number(req.nextUrl.searchParams.get("n") ?? DRILL_TARGET)));

  const dbItems = await getPublishedPool({ skillId: skill, limit: limit * 2 });
  const dbDrill = dbItems.map(dbToDrill);

  let combined: DrillItem[] = shuffle(dbDrill).slice(0, limit);
  let usedFallback = false;
  if (combined.length < STATIC_FALLBACK_THRESHOLD) {
    const staticItems: DrillItem[] = POOL.filter((p) => p.skillId === skill).map((p) => ({
      id: p.id,
      skillId: p.skillId,
      skill: p.skill,
      section: p.section,
      difficulty: p.difficulty,
      prompt: p.prompt,
      choices: p.choices,
      correct: p.correct,
      rationale: p.rationale,
      source: "static" as const,
    }));
    const seen = new Set(combined.map((c) => c.id));
    const topUp = shuffle(staticItems.filter((s) => !seen.has(s.id))).slice(0, limit - combined.length);
    combined = [...combined, ...topUp];
    if (topUp.length > 0) usedFallback = true;
  }

  return NextResponse.json({
    items: combined,
    counts: {
      requested: limit,
      returned: combined.length,
      db: combined.filter((c) => c.source === "db").length,
      static: combined.filter((c) => c.source === "static").length,
    },
    fallback: usedFallback,
  });
}
