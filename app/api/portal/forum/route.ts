import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const NewThread = z.object({
  title:    z.string().trim().min(3).max(140),
  body:     z.string().trim().min(10).max(20_000),
  category: z.enum(["approach", "lesson_plan", "win_story", "tools", "other"]),
});

export async function GET(req: Request) {
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ threads: [] });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const cat = url.searchParams.get("category");

  let q = sb.from("forum_threads").select("*").order("pinned", { ascending: false }).order("last_reply_at", { ascending: false }).limit(60);
  if (cat) q = q.eq("category", cat);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ threads: data ?? [] });
}

export async function POST(req: Request) {
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = NewThread.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid", details: parsed.error.issues }, { status: 400 });

  const { data, error } = await sb
    .from("forum_threads")
    .insert({
      author_id: user.id,
      title:     parsed.data.title,
      body:      parsed.data.body,
      category:  parsed.data.category,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ thread: data });
}
