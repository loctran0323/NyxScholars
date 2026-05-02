import { cn } from "@/lib/utils";

type HorizonDividerProps = {
  className?: string;
};

export function HorizonDivider({ className }: HorizonDividerProps) {
  return <div className={cn("horizon-divider", className)} role="separator" aria-hidden />;
}
