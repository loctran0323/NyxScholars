import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  tier: string;
  tagline: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  featured?: boolean;
}

export default function PricingCard({
  tier, tagline, description, features, cta, ctaHref, featured,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border p-8 flex flex-col transition-all duration-300",
        featured
          ? "border-[#d4a853]/35 bg-gradient-to-b from-[#1a2035] to-[#0f1521] shadow-[0_0_60px_rgba(212,168,83,0.08),0_0_0_1px_rgba(212,168,83,0.15)]"
          : "border-white/[0.07] bg-[#0f1521] card-hover"
      )}
    >
      {featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span className="px-4 py-1 rounded-full bg-gradient-to-r from-[#e0b55c] to-[#c99438] text-black text-[11px] font-black tracking-wide shadow-[0_4px_16px_rgba(212,168,83,0.3)]">
            Most Popular
          </span>
        </div>
      )}

      {/* Top */}
      <div className="mb-7">
        <h3 className="text-[#f0ece3] font-bold text-[1.2rem] mb-1">{tier}</h3>
        <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.12em] mb-3">{tagline}</p>
        <p className="text-[#8d9ab0] text-[13.5px] leading-relaxed">{description}</p>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <div className={cn(
              "w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-0.5",
              featured ? "bg-[#d4a853]/20" : "bg-white/[0.06]"
            )}>
              <Check size={10} strokeWidth={3} className={featured ? "text-[#d4a853]" : "text-[#8d9ab0]"} />
            </div>
            <span className="text-[#c8d0de] text-[13.5px] leading-snug">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={ctaHref}
        className={cn(
          "block w-full text-center py-3 rounded-xl font-bold text-[14px] transition-all",
          featured
            ? "bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black hover:from-[#eac068] hover:to-[#d4a045] shadow-[0_4px_20px_rgba(212,168,83,0.25)] hover:shadow-[0_8px_28px_rgba(212,168,83,0.35)]"
            : "border border-white/10 text-[#c8d0de] hover:border-white/20 hover:bg-white/[0.04]"
        )}
      >
        {cta}
      </Link>
    </div>
  );
}
