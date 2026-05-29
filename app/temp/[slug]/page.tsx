import type { Metadata } from "next";
import { loadStudentData, cleanSlug } from "@/lib/practice/student-data";
import { StudentPortal } from "../../students/[slug]/StudentPortal";

export const metadata: Metadata = {
  title: "Reading & Writing practice · Nyx",
  robots: { index: false, follow: false },
};

function displayName(slug: string): string {
  return cleanSlug(slug)
    .split("-")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ") || "there";
}

/** Alias of /students/[slug] — a "temp session" link that loads the same portal. */
export default async function TempPracticePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadStudentData(slug);
  return <StudentPortal data={data} displayName={displayName(slug)} />;
}
