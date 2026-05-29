import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";
import { questionsForSkill, SKILL_META } from "@/lib/practice/rw-bank";
import { cleanSlug } from "@/lib/practice/student-data";
import { isTalijaAuthed } from "@/lib/talija-auth";
import type { RWSkillKey } from "@/lib/practice/types";

interface RouteCtx {
  params: Promise<{ slug: string }>;
}

const VALID_KEYS = new Set(SKILL_META.map((s) => s.key));

/**
 * POST (Talija only): assign homework to Arush. Builds the question set
 * server-side from the chosen skills (hardest-first, round-robin across skills),
 * and records whether worked solutions should be released to Arush.
 */
export async function POST(req: NextRequest, { params }: RouteCtx) {
  const { slug } = await params;
  if (!(await isTalijaAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 });
  }

  const requested = (Array.isArray(body.skills) ? body.skills : []) as string[];
  let skills = requested.filter((k): k is RWSkillKey => VALID_KEYS.has(k as RWSkillKey));
  if (skills.length === 0) skills = SKILL_META.map((s) => s.key); // empty = everything

  const count = Math.max(4, Math.min(40, Number(body.count ?? 12)));
  const includeWorked = Boolean(body.includeWorked);
  const note = typeof body.note === "string" ? body.note.slice(0, 800) : "";

  // Hardest-first per skill, round-robin so the set spans the chosen skills.
  const pools = skills.map((k) =>
    [...questionsForSkill(k)].sort((a, b) => b.difficulty - a.difficulty),
  );
  const questionIds: string[] = [];
  let i = 0;
  while (questionIds.length < count && pools.some((p) => p.length > 0)) {
    const pool = pools[i % pools.length];
    const q = pool.shift();
    if (q) questionIds.push(q.id);
    i++;
  }

  const client = getServiceRoleClient();
  if (!client) {
    return NextResponse.json(
      { ok: false, reason: "not-configured", questionIds, count: questionIds.length },
    );
  }

  const { error } = await client.from("temp_homework").insert({
    slug: cleanSlug(slug),
    skills,
    question_ids: questionIds,
    include_worked: includeWorked,
    note,
  });

  if (error) return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, assigned: questionIds.length });
}
