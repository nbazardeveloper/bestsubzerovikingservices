import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label?: string;
  aspect?: "video" | "square" | "portrait" | "wide";
  className?: string;
  src?: string | null;
  alt?: string;
  /**
   * Optional alternate image shown at the md breakpoint and above, via a
   * <picture> source. `src` is used as the mobile-first fallback. Only one
   * of the two images is ever downloaded by the browser.
   */
  desktopSrc?: string;
  /**
   * Mark this as the hero / above-the-fold (likely LCP) image so it loads
   * eagerly with high fetch priority instead of being lazy-loaded.
   */
  priority?: boolean;
  /**
   * Fill the parent container instead of reserving its own aspect-ratio
   * box — use for full-bleed backgrounds where the parent is `relative`
   * and already sized (e.g. a hero section). No rounded corners.
   */
  fill?: boolean;
}

const aspectClass: Record<NonNullable<Props["aspect"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[16/7]",
};

export function ImagePlaceholder({
  label = "Image placeholder",
  aspect = "video",
  className,
  src,
  desktopSrc,
  alt,
  priority = false,
  fill = false,
}: Props) {
  const boxClass = fill
    ? "absolute inset-0"
    : cn("overflow-hidden rounded-lg", aspectClass[aspect]);

  if (src) {
    const img = (
      <img
        src={src}
        alt={alt ?? label}
        className="h-full w-full object-cover"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    );
    return (
      <div className={cn(boxClass, "bg-steel", className)}>
        {desktopSrc ? (
          <picture>
            <source media="(min-width: 768px)" srcSet={desktopSrc} />
            {img}
          </picture>
        ) : (
          img
        )}
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={alt ?? label}
      className={cn(
        boxClass,
        "relative flex items-center justify-center bg-steel text-steel-foreground",
        className,
      )}
    >
      <div aria-hidden className="bg-placeholder-gradient absolute inset-0 opacity-60" />
      <div className="relative flex flex-col items-center gap-2 text-xs uppercase tracking-widest">
        <ImageIcon className="h-6 w-6" aria-hidden />
        <span>{label}</span>
      </div>
    </div>
  );
}
