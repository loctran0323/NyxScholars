import { notFound } from "next/navigation";
import { MockRunner } from "./MockRunner";
import { getMockById, buildMockQuestions } from "../../content";

export const metadata = {
  title: "Mock test runner · Nyx",
};

export default async function MockRunPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mock = getMockById(id);
  if (!mock) notFound();

  const questions = buildMockQuestions(mock);

  return (
    <MockRunner
      mockId={mock.id}
      title={mock.title}
      questions={questions}
      durationMin={mock.durationMin}
    />
  );
}
