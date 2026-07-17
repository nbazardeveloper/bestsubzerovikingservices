import { useId } from "react";
import { cn } from "@/lib/utils";

const RING_UNIT = "13 YEARS ✦ TRUSTED SERVICE ✦ ";
const RING_TEXT = RING_UNIT.repeat(2);

interface Props {
  className?: string;
}

// Rotating trust-seal badge: a spinning ring of text around a fixed accent-colored
// center. Purely decorative visually (the fact is announced once via aria-label),
// and respects prefers-reduced-motion by only animating for users who allow motion.
export function AnniversaryBadge({ className }: Props) {
  const pathId = useId();

  return (
    <div
      role="img"
      aria-label="13 years of trusted appliance repair service"
      className={cn("relative h-32 w-32 flex-shrink-0 md:h-36 md:w-36", className)}
    >
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full drop-shadow-md motion-safe:animate-[spin_18s_linear_infinite]"
      >
        <defs>
          <path id={pathId} d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0" />
        </defs>
        {/* Outer frame — a plain circle is rotationally symmetric, so it reads as a
            static white border even though it's inside the spinning <svg>. Kept thin,
            with a real gap from the text ring (verified by rendering the SVG) so
            there's visible breathing room on both sides of the text. */}
        <circle cx="100" cy="100" r="96" fill="none" stroke="white" strokeWidth="2" />
        <text fill="white" fontSize="14" fontWeight="700" letterSpacing="0.04em">
          <textPath href={`#${pathId}`} startOffset="0%">
            {RING_TEXT}
          </textPath>
        </text>
      </svg>
      <div
        aria-hidden
        className="absolute inset-[21%] flex flex-col items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md"
      >
        <span className="text-2xl font-bold leading-none md:text-3xl">13</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide md:text-xs">Years</span>
      </div>
    </div>
  );
}
