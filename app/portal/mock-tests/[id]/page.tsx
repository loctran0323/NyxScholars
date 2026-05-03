import { ComingSoonPanel } from "@/components/portal/ComingSoonPanel";

export const metadata = {
  title: "Mock tests · Coming soon",
};

export default function MockTestDetailPage() {
  return (
    <ComingSoonPanel
      feature="Mock tests"
      title="This mock is being calibrated"
      italic="we want it real"
      blurb="The mock-test rotation isn't live yet. Once it is, this page becomes the start screen for the timed run plus your previous attempts."
      eta="Summer 2026"
      backHref="/portal/mock-tests"
      backLabel="Back to mock tests"
    />
  );
}
