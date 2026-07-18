import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

// A high-contrast, hard-to-miss visual callout for the three brands we
// specialize in. Brand names alone in body copy get skimmed past — this is
// a standalone band (bold display type + icon + dividers, on an inverted
// background) so the specialization reads instantly, not just as a sentence
// buried in a paragraph. No manufacturer logos are used (see BrandIcons.tsx
// for why), so the visual weight comes from scale, contrast and a
// consistent badge icon instead.
const SPECIALTY_BRANDS = ["Sub-Zero", "Viking", "Wolf"];

export function SpecialistBrandsBand({ className }: { className?: string }) {
  return (
    <section className={cn("border-y border-border bg-primary text-primary-foreground", className)}>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground/60">
          Certified specialists in
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-0 sm:divide-x sm:divide-primary-foreground/20">
          {SPECIALTY_BRANDS.map((b) => (
            <div key={b} className="flex items-center gap-3 px-6 first:pl-0 last:pr-0 sm:px-10">
              <BadgeCheck className="h-7 w-7 flex-shrink-0 text-accent" aria-hidden />
              <span className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                {b}
              </span>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-5 max-w-lg text-center text-sm text-primary-foreground/70">
          We also service other premium brands — Thermador, Bosch, Dacor, GE Monogram and
          Bertazzoni.
        </p>
      </div>
    </section>
  );
}
