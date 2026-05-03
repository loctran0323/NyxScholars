import { notFound, redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { HomeworkRunner } from "./HomeworkRunner";

interface RouteParams { params: Promise<{ id: string }> }

interface HomeworkRow {
  id: string;
  title: string;
  body: string | null;
  questions: { prompt: string; choices: string[]; correct_index: number; rationale?: string }[];
  results: { picked_index: number; correct: boolean }[] | null;
  completed_at: string | null;
}

export default async function Page({ params }: RouteParams) {
  const { id } = await params;
  const sb = await getSupabaseServerClient();
  if (!sb) redirect("/portal/login");
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data } = await sb
    .from("homework")
    .select("id, title, body, questions, results, completed_at")
    .eq("id", id)
    .eq("student_id", user.id)
    .maybeSingle();

  if (!data) notFound();

  return <HomeworkRunner homework={data as unknown as HomeworkRow} />;
}
