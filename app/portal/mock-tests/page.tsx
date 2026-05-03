import { ComingSoonPanel } from "@/components/portal/ComingSoonPanel";

export const metadata = {
  title: "Mock tests · Coming soon",
  description: "Full-length digital SAT/ACT mocks — coming soon.",
};

export default function MockTestsPage() {
  return (
    <ComingSoonPanel
      feature="Mock tests"
      title="Full-length, scored,"
      italic="hand-calibrated"
      blurb="We're building a rotation of full-length digital SAT and ACT mocks, each calibrated against three real test forms. Score reports flow directly into your sky map and your weekly digest."
      highlights={[
        "Adaptive section structure for digital SAT",
        "Scaled scoring with ±15-point precision (SAT) and ±1-point (ACT)",
        "New mock every two weeks once the rotation is live",
      ]}
      eta="Summer 2026"
    />
  );
}
