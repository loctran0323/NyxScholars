import { ComingSoonPanel } from "@/components/portal/ComingSoonPanel";

export const metadata = {
  title: "Mock test runner · Coming soon",
};

export default function MockRunPage() {
  return (
    <ComingSoonPanel
      feature="Mock tests"
      title="Timed runner is offline"
      italic="for now"
      blurb="The full-length runner is paused while we calibrate the question rotation. The Adaptive Intake (under Learn → Adaptive intake) is the closest thing currently live — it's a 14-question diagnostic, not a full-length mock, but it produces a real sky map."
      eta="Summer 2026"
      backHref="/portal/mock-tests"
      backLabel="Back to mock tests"
    />
  );
}
