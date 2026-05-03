import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const Reply = z.object({
  body: z.string().trim().min(1).max(20_000),
});

interface RouteCtx { params: Promise<{ id: string }> }

export async function GET(_req: Request, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [{ data: thread }, { data: replies }] = await Promise.all([
    sb.from("forum_threads").select("*").eq("id", id).maybeSingle(),
    sb.from("forum_replies").select("*").eq("thread_id", id).order("created_at", { ascending: true }),
  ]);
  if (!thread) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ thread, replies: replies ?? [] });
}

export async function POST(req: Request, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = Reply.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid", details: parsed.error.issues }, { status: 400 });

  const { data, error } = await sb
    .from("forum_replies")
    .insert({ thread_id: id, author_id: user.id, body: parsed.data.body })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reply: data });
}
