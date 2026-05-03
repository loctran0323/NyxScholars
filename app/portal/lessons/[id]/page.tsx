import { ComingSoonPanel } from "@/components/portal/ComingSoonPanel";

export const metadata = {
  title: "Video lessons · Coming soon",
};

export default function LessonDetailPage() {
  return (
    <ComingSoonPanel
      feature="Video lessons"
      title="Library is being recorded"
      italic="check back soon"
      blurb="Individual lesson pages will live here once the first batch ships. In the meantime, your sky map and Daily Review are the fastest way to convert a weak spot into a confident answer."
      eta="Summer 2026"
      backHref="/portal/lessons"
      backLabel="Back to video lessons"
    />
  );
}
