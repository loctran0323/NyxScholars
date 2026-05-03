import { requireAdminAuth } from "@/lib/admin-auth";
import { BroadcastForm } from "./BroadcastForm";

export const metadata = { title: "Broadcast · Admin" };

export default async function AdminBroadcastPage() {
  await requireAdminAuth();
  return (
    <div className="max-w-2xl mx-auto py-6">
      <header className="mb-6">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Admin</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)]">Broadcast announcement</h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Push an in-app notification to a segment. For email blasts wire this to{" "}
          <code className="text-[var(--accent)]">sendEmail</code> in <code className="text-[var(--accent)]">/api/admin/broadcast</code>.
        </p>
      </header>
      <BroadcastForm />
    </div>
  );
}
