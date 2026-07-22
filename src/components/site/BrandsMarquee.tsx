// Brands we service — an infinite marquee (paused on hover) shown as its own
// band right after the hero. The sr-only list keeps the brand names readable
// to screen readers and search engines without announcing the duplicated
// scroll copy. Previously lived at the bottom of the footer; moved up here so
// it reads immediately after the hero instead of only showing up once a
// visitor scrolls all the way down.
const BRANDS = [
  "Sub-Zero",
  "Wolf",
  "Viking",
  "Thermador",
  "Bosch",
  "Dacor",
  "GE Monogram",
  "Bertazzoni",
];

export function BrandsMarquee({ className }: { className?: string }) {
  return (
    <div className={`border-b border-white/10 bg-primary py-6 ${className ?? ""}`}>
      <span className="sr-only">Brands we service: {BRANDS.join(", ")}</span>
      <div className="marquee-edge-fade overflow-hidden" aria-hidden="true">
        <div className="animate-marquee flex w-max items-center">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex items-center">
              {BRANDS.map((b) => (
                <span key={`${rep}-${b}`} className="flex items-center gap-3 px-6">
                  <span className="font-display text-lg font-semibold tracking-tight text-primary-foreground whitespace-nowrap md:text-xl">
                    {b}
                  </span>
                  <span aria-hidden className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
