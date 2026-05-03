/**
 * Item-exposure tracker. Reads recent diagnostic_attempts for the user
 * and produces an exposure map suitable for handing to selectNextV2.
 * Capped at LOOKBACK_DAYS so old re-takes don't permanently lock items
 * out for a long-tenured student.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const LOOKBACK_DAYS = 90;

export async function loadExposure(sb: SupabaseClient<Database>, userId: string): Promise<Record<string, number>> {
  const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await sb
    .from("diagnostic_attempts")
    .select("question_id")
    .eq("user_id", userId)
    .gte("created_at", cutoff);
  if (error || !data) return {};
  const map: Record<string, number> = {};
  for (const row of data) {
    const id = (row as { question_id: string }).question_id;
    map[id] = (map[id] ?? 0) + 1;
  }
  return map;
}
