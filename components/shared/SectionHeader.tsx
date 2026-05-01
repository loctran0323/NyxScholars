import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(centered && "text-center", className)}>
      {eyebrow && (
        <p className={cn(
          "text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-5",
          !centered && "gold-line"
        )}>
          {eyebrow}
        </p>
      )}
      <h2 className="text-[clamp(1.7rem,3.5vw,2.4rem)] font-bold text-[#f0ece3] leading-tight tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "mt-4 text-[#8d9ab0] leading-[1.8] text-[15px]",
          centered ? "max-w-2xl mx-auto" : "max-w-xl"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
