import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ notifications: [] });

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await sb
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(40);

  if (error) {
    return NextResponse.json({ notifications: [], error: error.message }, { status: 500 });
  }

  const unread = (data ?? []).filter((n) => !(n as { read_at: string | null }).read_at).length;
  return NextResponse.json({ notifications: data ?? [], unread });
}

const PatchBody = z.object({
  ids: z.array(z.string().uuid()).optional(),
  all: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ ok: false }, { status: 503 });

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { ids?: string[]; all?: boolean };
  try {
    body = PatchBody.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  let q = sb.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", user.id);
  if (body.ids?.length) {
    q = q.in("id", body.ids);
  } else if (!body.all) {
    return NextResponse.json({ error: "Pass `ids` or `all: true`" }, { status: 400 });
  }

  const { error } = await q;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
