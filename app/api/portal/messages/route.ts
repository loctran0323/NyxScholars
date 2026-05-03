import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortalApi, readJson } from "@/lib/portal-auth";

const PostBody = z.object({
  content: z.string().trim().min(1).max(4000),
});

export async function GET(request: Request) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;
  const { supabase, user } = auth;

  const { searchParams } = new URL(request.url);
  const markRead = searchParams.get("markRead") === "true";

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (markRead) {
    const unreadIds = (messages ?? [])
      .filter((m) => m.sender === "nyx" && !m.read)
      .map((m) => m.id);
    if (unreadIds.length > 0) {
      await supabase.from("messages").update({ read: true }).in("id", unreadIds);
    }
  }

  return NextResponse.json({ messages: messages ?? [] });
}

export async function POST(request: Request) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const parsed = await readJson(request, PostBody);
  if (!parsed.ok) return parsed.response;

  const { data, error } = await auth.supabase
    .from("messages")
    .insert({
      student_id: auth.user.id,
      sender:     "student",
      content:    parsed.data.content,
      read:       true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: data }, { status: 201 });
}
