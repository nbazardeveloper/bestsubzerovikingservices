import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  /** Use "dark" when placed over a photo/dark background (e.g. the hero). */
  variant?: "light" | "dark";
}

// Uses the client's actual "100% Satisfaction Guarantee" badge artwork
// (their established trust mark from the old site), paired with a softened
// caption — the visual keeps brand recognition, the copy stays a concrete,
// honest promise rather than restating the absolute "100%" claim ourselves.
export function GuaranteeBadge({ className, variant = "light" }: Props) {
  const dark = variant === "dark";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-lg border px-4 py-3",
        dark ? "border-white/20 bg-black/30" : "border-accent/30 bg-accent/5",
        className,
      )}
    >
      <img
        src="/images/guarantee-badge.avif"
        alt="Satisfaction guarantee badge"
        className="h-12 w-12 flex-shrink-0"
      />
      <div>
        <p className={cn("text-sm font-semibold leading-tight", dark && "text-white")}>
          We stand behind every repair
        </p>
        <p className={cn("mt-0.5 text-xs", dark ? "text-white/70" : "text-muted-foreground")}>
          If something isn't right, we'll make it right.
        </p>
      </div>
    </div>
  );
}
