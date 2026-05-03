import { ComingSoonPanel } from "@/components/portal/ComingSoonPanel";

export const metadata = {
  title: "Video lessons · Coming soon",
  description: "Three-minute micro-lessons by Nyx tutors — coming soon.",
};

export default function LessonsPage() {
  return (
    <ComingSoonPanel
      feature="Video lessons"
      title="Three-minute walkthroughs,"
      italic="one skill at a time"
      blurb="We're recording a library of micro-lessons taught by the same tutors working with students each week. Each lesson cracks one skill: a pacing trick, a problem type, a writing move."
      highlights={[
        "3–5 minute videos, captioned and chunked by skill",
        "Tied directly to your sky map — what slipped, you can replay",
        "New lessons every other week, recorded in the current test format",
      ]}
      eta="Summer 2026"
    />
  );
}
