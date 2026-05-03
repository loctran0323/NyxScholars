import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortalApi, readJson } from "@/lib/portal-auth";
import { applyReview, type SrsCard, type SrsReview } from "@/lib/spaced-repetition";

export const runtime = "nodejs";

const Review = z.object({
  card_id: z.string().uuid(),
  grade:   z.number().int().min(0).max(5),
  ms:      z.number().int().nonnegative(),
});

const Create = z.object({
  skill_id: z.string().min(1),
  prompt:   z.string().min(1),
  answer:   z.string().min(1),
});

export async function GET() {
  const auth = await getPortalApi({ onMissing: NextResponse.json({ cards: [] }) });
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.supabase
    .from("srs_cards").select("*")
    .eq("user_id", auth.user.id)
    .lte("due_at", new Date().toISOString())
    .order("due_at", { ascending: true })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cards: data ?? [] });
}

export async function POST(req: Request) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const parsed = await readJson(req, Create);
  if (!parsed.ok) return parsed.response;

  const { data, error } = await auth.supabase
    .from("srs_cards")
    .insert({
      user_id:  auth.user.id,
      skill_id: parsed.data.skill_id,
      prompt:   parsed.data.prompt,
      answer:   parsed.data.answer,
    })
    .select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ card: data });
}

export async function PATCH(req: Request) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const parsed = await readJson(req, Review);
  if (!parsed.ok) return parsed.response;

  const { data: row, error: fetchErr } = await auth.supabase
    .from("srs_cards").select("*")
    .eq("id", parsed.data.card_id).eq("user_id", auth.user.id).single();
  if (fetchErr || !row) return NextResponse.json({ error: "Card not found" }, { status: 404 });

  const card: SrsCard = {
    id:       row.id,
    skillId:  row.skill_id,
    prompt:   row.prompt,
    answer:   row.answer,
    interval: row.interval_days,
    ease:     Number(row.ease),
    due:      row.due_at,
    reps:     row.reps,
    lapses:   row.lapses,
  };
  const review: SrsReview = {
    cardId: parsed.data.card_id,
    grade:  parsed.data.grade as 0 | 1 | 2 | 3 | 4 | 5,
    ms:     parsed.data.ms,
  };
  const next = applyReview(card, review);

  const { error } = await auth.supabase
    .from("srs_cards")
    .update({
      interval_days: next.interval,
      ease:          next.ease,
      due_at:        next.due,
      reps:          next.reps,
      lapses:        next.lapses,
    })
    .eq("id", parsed.data.card_id).eq("user_id", auth.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, card: next });
}
