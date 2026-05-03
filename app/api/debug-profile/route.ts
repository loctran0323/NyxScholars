import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase";

export async function GET() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "no supabase" });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not logged in" });

  const { data: anonProfile, error: anonError } = await supabase
    .from("profiles")
    .select("id, plan, plan_status, role")
    .eq("id", user.id)
    .single();

  const serviceClient = getServiceRoleClient();
  const { data: serviceProfile, error: serviceError } = serviceClient
    ? await serviceClient.from("profiles").select("id, plan, plan_status, role").eq("id", user.id).single()
    : { data: null, error: "no service client" };

  return NextResponse.json({
    userId: user.id,
    email: user.email,
    anonProfile,
    anonError: anonError?.message,
    serviceProfile,
    serviceError: typeof serviceError === "string" ? serviceError : serviceError?.message,
  });
}
