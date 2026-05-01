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
    <div className="pt-16 min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#f0ede6]">Admin Dashboard</h1>
            <p className="text-[#8896a7] text-sm mt-1">
              {leads.length} lead{leads.length !== 1 ? "s" : ""} submitted
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSupabaseConnected ? "bg-green-400" : "bg-amber-400"}`} />
            <span className="text-[#8896a7] text-xs">
              {isSupabaseConnected ? "Supabase connected" : "Supabase not configured"}
            </span>
          </div>
        </div>

        {!isSupabaseConnected && (
          <div className="mb-6 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400 text-sm">
            Supabase is not configured. Leads submitted through the form are logged server-side only.
            Set <code className="bg-[#0f1623] px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
            <code className="bg-[#0f1623] px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
            <code className="bg-[#0f1623] px-1 py-0.5 rounded">SUPABASE_SERVICE_ROLE_KEY</code> to enable lead storage.
          </div>
        )}

        <AdminLeadTable leads={leads} />
        <AdminPortalSection />
      </div>
    </div>
  );
}
