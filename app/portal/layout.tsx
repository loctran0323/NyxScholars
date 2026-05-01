import { getSupabaseServerClient } from "@/lib/supabase/server";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import type { Profile } from "@/types/portal";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#060912] flex items-center justify-center">
        <div className="text-center px-6 max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4a853] to-[#a07830] flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-black text-lg">N</span>
          </div>
          <h2 className="text-xl font-bold text-[#f0ece3] mb-2">Portal Unavailable</h2>
          <p className="text-[#8d9ab0] text-sm leading-relaxed">
            The student portal requires Supabase to be configured. Add your{" "}
            <code className="text-[#d4a853] text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="text-[#d4a853] text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
            environment variables to enable authentication.
          </p>
        </div>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Unauthenticated — show auth pages full-screen
  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#060912] overflow-auto">
        {children}
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { count: unreadCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("student_id", user.id)
    .eq("sender", "nyx")
    .eq("read", false);

  return (
    <div className="fixed inset-0 z-[100] bg-[#060912] flex overflow-hidden">
      <PortalSidebar
        profile={profile as Profile | null}
        userEmail={user.email ?? ""}
        unreadCount={unreadCount ?? 0}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile spacer for top bar */}
        <div className="md:hidden h-14 shrink-0" />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-5 py-7 md:px-8 md:py-9">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
