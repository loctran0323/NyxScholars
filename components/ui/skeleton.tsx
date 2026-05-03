import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("skeleton rounded-md", className)}
    />
  );
}
