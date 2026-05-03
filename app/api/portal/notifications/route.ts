import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortalApi, readJson } from "@/lib/portal-auth";

export const runtime = "nodejs";

const PatchBody = z.object({
  ids: z.array(z.string().uuid()).optional(),
  all: z.boolean().optional(),
});

export async function GET() {
  const auth = await getPortalApi({ onMissing: NextResponse.json({ notifications: [], unread: 0 }) });
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.supabase
    .from("notifications").select("*")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false })
    .limit(40);

  if (error) return NextResponse.json({ notifications: [], error: error.message }, { status: 500 });
  const unread = (data ?? []).filter((n) => !(n as { read_at: string | null }).read_at).length;
  return NextResponse.json({ notifications: data ?? [], unread });
}

export async function PATCH(req: Request) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const parsed = await readJson(req, PatchBody);
  if (!parsed.ok) return parsed.response;

  let q = auth.supabase
    .from("notifications").update({ read_at: new Date().toISOString() })
    .eq("user_id", auth.user.id);
  if (parsed.data.ids?.length) {
    q = q.in("id", parsed.data.ids);
  } else if (!parsed.data.all) {
    return NextResponse.json({ error: "Pass `ids` or `all: true`" }, { status: 400 });
  }

  const { error } = await q;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
