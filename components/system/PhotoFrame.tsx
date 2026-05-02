import Image from "next/image";
import { cn } from "@/lib/utils";

type Aspect = "auto" | "square" | "portrait" | "landscape" | "wide";
type Mask = "none" | "top" | "bottom" | "both";

type PhotoFrameProps = {
  src: string;
  alt: string;
  index?: string;
  caption?: string;
  aspect?: Aspect;
  mask?: Mask;
  priority?: boolean;
  hoverZoom?: boolean;
  className?: string;
  rounded?: "default" | "lg" | "none";
  fill?: boolean;
};

const ASPECT_CLASSES: Record<Aspect, string> = {
  auto: "",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/9]",
  wide: "aspect-[21/9]",
};

const MASK_CLASSES: Record<Mask, string> = {
  none: "",
  top: "photo-mask-top",
  bottom: "photo-mask-bottom",
  both: "photo-mask-both",
};

const ROUNDED: Record<"default" | "lg" | "none", string> = {
  default: "rounded-2xl",
  lg: "rounded-3xl",
  none: "rounded-none",
};

export function PhotoFrame({
  src,
  alt,
  index,
  caption,
  aspect = "landscape",
  mask = "none",
  priority = false,
  hoverZoom = false,
  className,
  rounded = "default",
  fill = true,
}: PhotoFrameProps) {
  return (
    <figure className={cn("relative", className)}>
      <div
        className={cn(
          "relative overflow-hidden border border-[var(--border)] bg-[var(--surface)]",
          ASPECT_CLASSES[aspect],
          ROUNDED[rounded],
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className={cn(
            "object-cover transition-transform duration-[var(--dur-transform)] ease-[var(--ease-out-soft)]",
            MASK_CLASSES[mask],
            hoverZoom && "hover:scale-[1.02]",
          )}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 flex items-center gap-3 font-mono text-[var(--fs-12)] uppercase tracking-[0.18em] text-[var(--text-3)]">
          {index ? <span className="text-[var(--accent)]">{index}</span> : null}
          <span>{caption}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
