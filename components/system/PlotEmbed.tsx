import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PlotEmbedProps = {
  src?: string;
  alt?: string;
  caption?: string;
  source?: string;
  index?: string;
  aspect?: "landscape" | "wide" | "square" | "tall";
  className?: string;
  children?: ReactNode;
};

const ASPECT: Record<NonNullable<PlotEmbedProps["aspect"]>, string> = {
  landscape: "aspect-[16/9]",
  wide: "aspect-[21/9]",
  square: "aspect-square",
  tall: "aspect-[4/5]",
};

export function PlotEmbed({
  src,
  alt = "",
  caption,
  source,
  index,
  aspect = "landscape",
  className,
  children,
}: PlotEmbedProps) {
  return (
    <figure className={cn("plot-frame p-4 md:p-6", className)}>
      <div className={cn("relative w-full overflow-hidden rounded-xl bg-[var(--bg-2)]", ASPECT[aspect])}>
        {children
          ? children
          : src
            ? <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-contain p-4" />
            : <PlotPlaceholder />}
      </div>
      {(caption || source) ? (
        <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[var(--fs-12)] uppercase tracking-[0.16em] text-[var(--text-3)]">
          <span className="flex items-center gap-3">
            {index ? <span className="text-[var(--accent)]">{index}</span> : null}
            {caption ? <span>{caption}</span> : null}
          </span>
          {source ? <span className="text-[var(--text-3)]/80">Source · {source}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

function PlotPlaceholder() {
  return (
    <svg viewBox="0 0 600 320" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="plotLine" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={i}
          x1="0" x2="600"
          y1={(i + 1) * 50}
          y2={(i + 1) * 50}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />
      ))}
      <path
        d="M 20 240 C 80 200, 140 220, 200 180 S 320 90, 380 110 S 500 60, 580 70"
        fill="none"
        stroke="url(#plotLine)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 20 240 C 80 200, 140 220, 200 180 S 320 90, 380 110 S 500 60, 580 70 L 580 320 L 20 320 Z"
        fill="url(#plotLine)"
        opacity="0.08"
      />
    </svg>
  );
}
