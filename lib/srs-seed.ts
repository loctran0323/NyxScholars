/**
 * SRS seeding helpers — turn wrong answers (from diagnostic, homework, or
 * session summaries) into review cards so they re-surface in /portal/practice.
 *
 * Rules:
 *   • One card per (user_id, source_id). Avoid duplicates if the same item
 *     is missed twice — the card just resets via the SRS algorithm.
 *   • Dedup against existing cards by `prompt` substring match (cheap; if
 *     the prompt differs by even a number we treat it as a new card).
 *   • Best-effort: failures are swallowed so user-facing flows never error.
 */

import { getServiceRoleClient } from "@/lib/supabase";

interface SeedInput {
  userId: string;
  skillId: string;
  prompt: string;
  answer: string;
}

export async function seedSrsCard(input: SeedInput): Promise<void> {
  const sb = getServiceRoleClient();
  if (!sb) return;
  try {
    // Cheap dedup: if a card with the same prompt+user already exists,
    // skip — the SRS algorithm will re-surface the original soon enough.
    const { data: existing } = await sb
      .from("srs_cards")
      .select("id")
      .eq("user_id", input.userId)
      .eq("prompt", input.prompt)
      .maybeSingle();
    if (existing) return;

    await sb.from("srs_cards").insert({
      user_id:  input.userId,
      skill_id: input.skillId,
      prompt:   input.prompt,
      answer:   input.answer,
      due_at:   new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    });
  } catch {
    /* never crash callers */
  }
}

export async function seedSrsCards(inputs: SeedInput[]): Promise<number> {
  if (inputs.length === 0) return 0;
  const sb = getServiceRoleClient();
  if (!sb) return 0;

  // Bulk dedup: load existing prompts for this user, filter inputs.
  const userId = inputs[0].userId;
  const { data: existingRows } = await sb
    .from("srs_cards")
    .select("prompt")
    .eq("user_id", userId);
  const seen = new Set<string>((existingRows ?? []).map((r) => (r as { prompt: string }).prompt));

  const fresh = inputs.filter((i) => !seen.has(i.prompt));
  if (fresh.length === 0) return 0;

  const due = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
  const rows = fresh.map((i) => ({
    user_id:  i.userId,
    skill_id: i.skillId,
    prompt:   i.prompt,
    answer:   i.answer,
    due_at:   due,
  }));

  const { error } = await sb.from("srs_cards").insert(rows);
  if (error) return 0;
  return rows.length;
}
