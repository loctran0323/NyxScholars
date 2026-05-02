import { getServiceRoleClient } from "@/lib/supabase";
import { Lead } from "@/types/lead";
import AdminLeadTable from "@/components/shared/AdminLeadTable";
import AdminPortalSection from "@/components/shared/AdminPortalSection";

async function getLeads(): Promise<Lead[]> {
  const client = getServiceRoleClient();
  if (!client) return [];

  const { data, error } = await client
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch leads:", error);
    return [];
  }
  return data as Lead[];
}

export default async function AdminDashboard() {
  const leads = await getLeads();
  const isSupabaseConnected = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-[68px]">
      <div className="max-w-5xl mx-auto px-6 py-14">

        {/* Page header */}
        <div className="mb-12">
          <p className="text-[var(--accent)] text-[11px] font-bold uppercase tracking-[0.15em] mb-3">Nyx</p>
          <h1 className="text-[2rem] font-bold text-[var(--text-1)] tracking-tight">Admin Dashboard</h1>
          {!isSupabaseConnected && (
            <p className="mt-3 text-amber-400 text-[13px]">
              ⚠ Supabase not configured — data won&apos;t persist.
            </p>
          )}
        </div>

        {/* Leads */}
        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-[15px] font-semibold text-[var(--text-1)]">Consultation Requests</h2>
            <span className="text-[var(--text-3)] text-[13px]">{leads.length} total</span>
          </div>
          <AdminLeadTable leads={leads} />
        </section>

        {/* Sessions + Messages */}
        <AdminPortalSection />
      </div>
    </div>
  );
}
