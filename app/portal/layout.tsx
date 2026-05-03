import { getSupabaseServerClient } from "@/lib/supabase/server";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { WelcomeBootstrap } from "@/components/portal/WelcomeBootstrap";
import Image from "next/image";
import type { Profile } from "@/types/portal";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="fixed inset-0 z-[100] bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center px-6 max-w-sm">
          <div className="flex justify-center mb-6">
            <Image src="/design/stacked-lockup.png" alt="Nyx" width={120} height={150} className="opacity-95" priority />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-1)] mb-2 font-[family-name:var(--font-fraunces)]">
            Portal unavailable
          </h2>
          <p className="text-[var(--text-2)] text-sm leading-relaxed">
            The student portal requires Supabase to be configured. Add your{" "}
            <code className="text-[var(--accent)] text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="text-[var(--accent)] text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> environment
            variables to enable authentication.
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
      <div className="fixed inset-0 z-[100] bg-[var(--bg)] overflow-auto">
        {children}
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const typedProfile = profile as Profile | null;

  const { count: unreadCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("student_id", user.id)
    .eq("sender", "nyx")
    .eq("read", false);

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--bg)] flex overflow-hidden">
      <PortalSidebar
        profile={typedProfile}
        userEmail={user.email ?? ""}
        unreadCount={unreadCount ?? 0}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile spacer for top bar */}
        <div className="md:hidden h-14 shrink-0" />
        <main
          id="main"
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 40% at 60% -10%, var(--accent-dim) 0%, transparent 60%)",
            backgroundAttachment: "local",
          }}
        >
          <div className="max-w-[1080px] mx-auto px-6 py-8 md:px-10 md:py-12 pb-32">
            {children}
          </div>
        </main>
        <WelcomeBootstrap />
      </div>
    </div>
  );
}
