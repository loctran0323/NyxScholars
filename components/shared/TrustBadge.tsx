import { LucideIcon } from "lucide-react";

interface TrustBadgeProps {
  icon: LucideIcon;
  label: string;
  sub?: string;
}

export default function TrustBadge({ icon: Icon, label, sub }: TrustBadgeProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#161e2e] border border-[#2a3a52] hover:border-amber-500/30 transition-colors">
      <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-amber-400" />
      </div>
      <div>
        <p className="text-[#f0ede6] text-sm font-medium leading-tight">{label}</p>
        {sub && <p className="text-[#8896a7] text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
