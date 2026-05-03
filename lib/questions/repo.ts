import { getServiceRoleClient } from "@/lib/supabase";

export interface DbQuestion {
  id: string;
  skill_id: string;
  skill_name: string;
  section: "Math" | "Reading & Writing";
  difficulty: number;
  prompt: string;
  choices: string[];
  correct_index: number;
  rationale: string | null;
  status: "active" | "draft" | "retired";
  origin: "admin" | "generated" | "static" | "community";
  external_key: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface PublishedPoolFilters {
  skillId?: string;
  section?: "Math" | "Reading & Writing";
  limit?: number;
  excludeIds?: string[];
}

export async function getPublishedPool(
  filters: PublishedPoolFilters = {},
): Promise<DbQuestion[]> {
  const sb = getServiceRoleClient();
  if (!sb) return [];

  let q = sb.from("diagnostic_questions").select("*").eq("status", "active");
  if (filters.skillId) q = q.eq("skill_id", filters.skillId);
  if (filters.section) q = q.eq("section", filters.section);
  if (filters.excludeIds && filters.excludeIds.length > 0) {
    q = q.not("id", "in", `(${filters.excludeIds.map((id) => `"${id}"`).join(",")})`);
  }
  if (filters.limit) q = q.limit(filters.limit);

  const { data, error } = await q;
  if (error) {
    console.error("[questions.repo] getPublishedPool", error.message);
    return [];
  }
  return (data ?? []) as DbQuestion[];
}

export async function publishedCountsBySkill(): Promise<Record<string, number>> {
  const sb = getServiceRoleClient();
  if (!sb) return {};
  const { data, error } = await sb
    .from("diagnostic_questions")
    .select("skill_id")
    .eq("status", "active");
  if (error) {
    console.error("[questions.repo] publishedCountsBySkill", error.message);
    return {};
  }
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const skillId = (row as { skill_id: string }).skill_id;
    counts[skillId] = (counts[skillId] ?? 0) + 1;
  }
  return counts;
}
