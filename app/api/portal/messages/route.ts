import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const markRead = searchParams.get("markRead") === "true";

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Mark nyx messages as read
  if (markRead) {
    const unreadIds = (messages ?? [])
      .filter((m) => m.sender === "nyx" && !m.read)
      .map((m) => m.id);

    if (unreadIds.length > 0) {
      await supabase
        .from("messages")
        .update({ read: true })
        .in("id", unreadIds);
    }
  }

  return NextResponse.json({ messages: messages ?? [] });
}

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { content } = body;
  if (!content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Message content is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      student_id: user.id,
      sender: "student",
      content: content.trim(),
      read: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: data }, { status: 201 });
}
