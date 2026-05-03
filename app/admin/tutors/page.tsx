import { TUTORS } from "@/lib/mock/tutors";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { ShieldCheck } from "lucide-react";
import { requireAdminAuth } from "@/lib/admin-auth";
import { getServiceRoleClient } from "@/lib/supabase";
import { TutorVerifyControls } from "./TutorVerifyControls";

export const metadata = { title: "Tutors · Admin" };

interface DBTutor {
  id: string;
  full_name: string | null;
  school: string | null;
  verified_at: string | null;
  nda_signed_at: string | null;
  background_check_status: string | null;
}

export default async function AdminTutorsPage() {
  await requireAdminAuth();

  const sb = getServiceRoleClient();
  let dbTutors: DBTutor[] = [];
  if (sb) {
    const { data } = await sb
      .from("profiles")
      .select("id, full_name, school, verified_at, nda_signed_at, background_check_status")
      .eq("role", "teacher")
      .order("full_name");
    dbTutors = (data ?? []) as unknown as DBTutor[];
  }

  return (
    <div className="max-w-6xl mx-auto py-6">
      <header className="mb-6">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Admin</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)]">Tutor roster</h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Live tutor profiles from Supabase + the sample roster used in marketing pages. Verify, NDA-flag,
          and update background-check status inline.
        </p>
      </header>

      <section className="rounded-2xl border border-[var(--border)] overflow-hidden mb-8">
        <header className="px-5 py-3 border-b border-[var(--border)] bg-[var(--bg-2)]">
          <h2 className="text-[13px] font-semibold text-[var(--text-1)]">Live tutors ({dbTutors.length})</h2>
        </header>
        {dbTutors.length === 0 ? (
          <div className="px-5 py-8 text-center text-[var(--text-3)] text-[13px]">
            No tutors have signed up via the portal yet.
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead className="bg-[var(--bg-2)] text-[11.5px] uppercase tracking-wider text-[var(--text-3)]">
              <tr>
                <th className="text-left px-4 py-3">Tutor</th>
                <th className="text-left px-4 py-3">School</th>
                <th className="text-left px-4 py-3">Verified</th>
                <th className="text-left px-4 py-3">NDA</th>
                <th className="text-left px-4 py-3">Background</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {dbTutors.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-[var(--text-1)] font-semibold">{t.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-[var(--text-2)]">{t.school ?? "—"}</td>
                  <td className="px-4 py-3">
                    {t.verified_at ? (
                      <Badge variant="verified"><ShieldCheck size={10} /> Yes</Badge>
                    ) : (
                      <Badge variant="default">—</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {t.nda_signed_at ? <Badge variant="green">Signed</Badge> : <Badge variant="default">—</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={t.background_check_status === "cleared" ? "green" : t.background_check_status === "flagged" ? "red" : "default"}>
                      {t.background_check_status ?? "not started"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <TutorVerifyControls
                      tutorId={t.id}
                      verified={!!t.verified_at}
                      ndaSigned={!!t.nda_signed_at}
                      background={(t.background_check_status as "not_started" | "pending" | "cleared" | "flagged" | null) ?? "not_started"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="rounded-2xl border border-[var(--border)] overflow-hidden">
        <header className="px-5 py-3 border-b border-[var(--border)] bg-[var(--bg-2)]">
          <h2 className="text-[13px] font-semibold text-[var(--text-1)]">Marketing roster (lib/mock/tutors)</h2>
          <p className="text-[11.5px] text-[var(--text-3)] mt-0.5">
            These are surfaced on /tutors and /portal/match. Add real tutors above instead.
          </p>
        </header>
        <table className="w-full text-[13px]">
          <thead className="bg-[var(--bg-2)] text-[11.5px] uppercase tracking-wider text-[var(--text-3)]">
            <tr>
              <th className="text-left px-4 py-3">Tutor</th>
              <th className="text-left px-4 py-3">School</th>
              <th className="text-left px-4 py-3">Subjects</th>
              <th className="text-right px-4 py-3">SAT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {TUTORS.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3 text-[var(--text-1)] font-semibold">{t.name}</td>
                <td className="px-4 py-3 text-[var(--text-2)]">{t.school}</td>
                <td className="px-4 py-3 text-[var(--text-2)]">{t.tags.slice(0, 2).join(", ")}</td>
                <td className="px-4 py-3 text-right text-[var(--text-1)] font-mono">{t.satScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
