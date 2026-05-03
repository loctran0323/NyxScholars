import { TUTORS } from "@/lib/mock/tutors";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { ShieldCheck } from "lucide-react";
import { requireAdminAuth } from "@/lib/admin-auth";

export const metadata = { title: "Tutors · Admin" };

export default async function AdminTutorsPage() {
  await requireAdminAuth();
  return (
    <div className="max-w-6xl mx-auto py-6">
      <header className="mb-6">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Admin</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)]">Tutor roster</h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Hours logged, NPS, retention, and verification state for every active tutor.
        </p>
      </header>
      <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-[var(--bg-2)] text-[11.5px] uppercase tracking-wider text-[var(--text-3)]">
            <tr>
              <th className="text-left px-4 py-3">Tutor</th>
              <th className="text-left px-4 py-3">School</th>
              <th className="text-left px-4 py-3">Subjects</th>
              <th className="text-left px-4 py-3">Verified</th>
              <th className="text-right px-4 py-3">Hours / 30d</th>
              <th className="text-right px-4 py-3">NPS</th>
              <th className="text-right px-4 py-3">Retention</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {TUTORS.map((t, i) => (
              <tr key={t.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-[var(--text-1)] font-semibold">{t.name}</td>
                <td className="px-4 py-3 text-[var(--text-2)]">{t.school}</td>
                <td className="px-4 py-3 text-[var(--text-2)]">{t.tags.slice(0, 2).join(", ")}</td>
                <td className="px-4 py-3">
                  <Tooltip content="Verified score report, current enrollment, NDA signed.">
                    <Badge variant="verified"><ShieldCheck size={10} /> Verified</Badge>
                  </Tooltip>
                </td>
                <td className="px-4 py-3 text-right text-[var(--text-1)] font-mono">{(18 + (i * 7) % 22)}</td>
                <td className="px-4 py-3 text-right text-[var(--text-1)] font-mono">{60 + ((i * 11) % 35)}</td>
                <td className="px-4 py-3 text-right text-[var(--text-1)] font-mono">{84 + ((i * 5) % 14)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-[var(--text-3)] mt-3">
        Hours, NPS, retention shown above are placeholders — wire to <code className="text-[var(--accent)]">audit_log</code> +{" "}
        <code className="text-[var(--accent)]">sessions</code> queries for live data.
      </p>
    </div>
  );
}
