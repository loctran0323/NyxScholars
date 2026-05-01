import { cn } from "@/lib/utils";

interface TutorCardProps {
  name: string;
  school: string;
  major: string;
  subjects: string[];
  bio: string;
  testStrengths: string[];
  className?: string;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const schoolConfig: Record<string, { color: string; bg: string }> = {
  Princeton: { color: "#e87722", bg: "rgba(232,119,34,0.12)" },
  Harvard:   { color: "#a51c30", bg: "rgba(165,28,48,0.12)" },
  Yale:      { color: "#5b8dd9", bg: "rgba(91,141,217,0.12)" },
  Columbia:  { color: "#75aadb", bg: "rgba(117,170,219,0.12)" },
  MIT:       { color: "#cf3232", bg: "rgba(207,50,50,0.12)" },
  Stanford:  { color: "#cf4520", bg: "rgba(207,69,32,0.12)" },
};

export default function TutorCard({
  name, school, major, subjects, bio, testStrengths, className,
}: TutorCardProps) {
  const initials = getInitials(name);
  const cfg = schoolConfig[school] || { color: "#d4a853", bg: "rgba(212,168,83,0.12)" };

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.07] bg-[#0f1521] p-6 card-hover",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-[13px] font-black"
          style={{ background: cfg.bg, border: `1px solid ${cfg.color}25` }}
        >
          <span style={{ color: cfg.color }}>{initials}</span>
        </div>
        <div className="min-w-0">
          <h3 className="text-[#f0ece3] font-semibold text-[15.5px] leading-tight">{name}</h3>
          <span
            className="mt-1.5 inline-block text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full"
            style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}25` }}
          >
            {school}
          </span>
        </div>
      </div>

      {/* Major */}
      <p className="text-[12px] text-[#4e5d72] mb-1">
        <span className="text-[#8d9ab0]">Major — </span>{major}
      </p>

      {/* Bio */}
      <p className="text-[#8d9ab0] text-[13.5px] leading-relaxed mt-3 mb-5">{bio}</p>

      {/* Divider */}
      <div className="h-px bg-white/[0.05] mb-4" />

      {/* Tags */}
      <div className="space-y-3">
        <div>
          <p className="text-[#4e5d72] text-[11px] uppercase tracking-widest font-semibold mb-2">Subjects</p>
          <div className="flex flex-wrap gap-1.5">
            {subjects.map((s) => (
              <span key={s} className="text-[11.5px] px-2.5 py-1 rounded-lg bg-white/[0.04] text-[#8d9ab0] border border-white/[0.06]">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[#4e5d72] text-[11px] uppercase tracking-widest font-semibold mb-2">Test Scores</p>
          <div className="flex flex-wrap gap-1.5">
            {testStrengths.map((s) => (
              <span key={s} className="text-[11.5px] px-2.5 py-1 rounded-lg bg-[#d4a853]/10 text-[#d4a853] border border-[#d4a853]/20">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
