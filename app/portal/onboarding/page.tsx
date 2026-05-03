import { OnboardingWizard } from "./OnboardingWizard";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const sb = await getSupabaseServerClient();
  if (!sb) redirect("/portal/login");
  const { data: { user } } = await sb!.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await sb!.from("profiles").select("*").eq("id", user.id).single();

  return (
    <div className="max-w-2xl mx-auto">
      <OnboardingWizard
        defaultName={profile?.full_name ?? user.email?.split("@")[0] ?? ""}
        defaultTargetTest={(profile?.target_test as "SAT" | "ACT" | null) ?? null}
        defaultTargetScore={profile?.target_score ?? null}
        defaultGrade={profile?.grade ?? null}
      />
    </div>
  );
}
