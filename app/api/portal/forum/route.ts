import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortalApi, readJson } from "@/lib/portal-auth";

export const runtime = "nodejs";

const NewThread = z.object({
  title:    z.string().trim().min(3).max(140),
  body:     z.string().trim().min(10).max(20_000),
  category: z.enum(["approach", "lesson_plan", "win_story", "tools", "other"]),
});

export async function GET(req: Request) {
  const auth = await getPortalApi({ onMissing: NextResponse.json({ threads: [] }) });
  if (!auth.ok) return auth.response;

  const cat = new URL(req.url).searchParams.get("category");
  let q = auth.supabase
    .from("forum_threads").select("*")
    .order("pinned", { ascending: false })
    .order("last_reply_at", { ascending: false })
    .limit(60);
  if (cat) q = q.eq("category", cat);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ threads: data ?? [] });
}

export async function POST(req: Request) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const parsed = await readJson(req, NewThread);
  if (!parsed.ok) return parsed.response;

  const { data, error } = await auth.supabase
    .from("forum_threads")
    .insert({
      author_id: auth.user.id,
      title:     parsed.data.title,
      body:      parsed.data.body,
      category:  parsed.data.category,
    })
    .select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ thread: data });
}
