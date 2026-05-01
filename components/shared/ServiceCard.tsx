import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
  href?: string;
  comingSoon?: boolean;
  className?: string;
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  features,
  href,
  comingSoon,
  className,
}: ServiceCardProps) {
  const card = (
    <div
      className={cn(
        "group relative h-full rounded-2xl border p-6 transition-all duration-300",
        comingSoon
          ? "border-white/[0.05] bg-[#0f1521]/60 opacity-60 cursor-default"
          : "border-white/[0.07] bg-[#0f1521] card-hover",
        className
      )}
    >
      {comingSoon && (
        <span className="absolute top-4 right-4 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#d4a853]/10 text-[#d4a853] border border-[#d4a853]/20">
          Coming Soon
        </span>
      )}

      <div className="w-11 h-11 rounded-xl mb-5 flex items-center justify-center bg-gradient-to-br from-[#d4a853]/15 to-[#d4a853]/5 border border-[#d4a853]/10 group-hover:from-[#d4a853]/25 group-hover:to-[#d4a853]/10 transition-all">
        <Icon size={20} className="text-[#d4a853]" />
      </div>

      <h3 className="text-[#f0ece3] font-semibold text-[16px] mb-2.5">{title}</h3>
      <p className="text-[#8d9ab0] text-[13.5px] leading-relaxed mb-4">{description}</p>

      {features && features.length > 0 && (
        <ul className="space-y-2 mb-5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-[#8d9ab0] text-[12.5px]">
              <span className="text-[#d4a853]/60 mt-1 shrink-0">›</span>
              {f}
            </li>
          ))}
        </ul>
      )}

      {href && !comingSoon && (
        <div className="flex items-center gap-1 text-[#d4a853] text-[13px] font-medium opacity-0 group-hover:opacity-100 group-hover:gap-1.5 transition-all duration-200">
          Learn more <ArrowRight size={12} />
        </div>
      )}
    </div>
  );

  if (href && !comingSoon) return <Link href={href} className="block h-full">{card}</Link>;
  return card;
}
