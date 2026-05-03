import { notFound, redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { POOL } from "@/lib/diagnostic";
import { MOCKS } from "../../content";
import { MockRunner } from "./MockRunner";

interface RouteCtx { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return MOCKS.filter((m) => m.status !== "coming-soon").map((m) => ({ id: m.id }));
}

export default async function Page({ params }: RouteCtx) {
  const { id } = await params;
  const mock = MOCKS.find((m) => m.id === id);
  if (!mock || mock.status === "coming-soon") notFound();

  const sb = await getSupabaseServerClient();
  if (!sb) redirect("/portal/login");
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/portal/login");

  // Pull a representative cross-section from POOL — in production this would
  // be a dedicated mock-test bank with calibrated forms.
  const sample = POOL
    .filter((q) => mock.test === "SAT" ? true : q.section === "Math") // ACT mock just samples math for the demo
    .slice(0, Math.min(mock.questions, 30));

  return (
    <MockRunner
      mockId={mock.id}
      title={mock.title}
      questions={sample.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        choices: q.choices,
        correctIndex: q.correct,
        rationale: q.rationale,
      }))}
      durationMin={Math.min(mock.durationMin, 60)}
    />
  );
}
