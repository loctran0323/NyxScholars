import { requirePortalUser } from "@/lib/portal-auth";
import DiagnosticClient from "./DiagnosticClient";
import type { DiagnosticSummary } from "./DiagnosticClient";

export default async function DiagnosticPage() {
  const { supabase, user } = await requirePortalUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("notif_prefs")
    .eq("id", user.id)
    .maybeSingle();

  const meta = ((profile as { notif_prefs: Record<string, unknown> | null } | null)?.notif_prefs ?? {}) as Record<string, unknown>;
  const summary = (meta.diagnostic_summary ?? null) as DiagnosticSummary | null;

  return <DiagnosticClient existingSummary={summary} />;
}
