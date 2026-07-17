import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  quote: string;
  author: string;
  meta: string;
  time: string;
  service?: string;
}

interface Props {
  testimonials: Testimonial[];
  className?: string;
}

// Real Google reviews, presented as an auto-advancing carousel (pauses on
// hover/focus). Uses embla-carousel-react, which was already a project
// dependency (pulled in via shadcn/ui) — no new package needed.
export function TestimonialCarousel({ testimonials, className }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || isPaused) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), 6000);
    return () => window.clearInterval(id);
  }, [emblaApi, isPaused]);

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((t, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%] px-2 text-center">
              <div className="flex justify-center" aria-hidden>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <blockquote className="mt-6 text-2xl font-medium leading-snug md:text-3xl">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <footer className="mt-6 text-sm text-primary-foreground/70">
                <span className="font-semibold text-primary-foreground">{t.author}</span> · {t.meta} · {t.time}
                {t.service ? (
                  <span className="mt-1 block text-xs uppercase tracking-widest text-primary-foreground/50">
                    {t.service}
                  </span>
                ) : null}
              </footer>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous review"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/25 text-primary-foreground/70 transition-colors hover:border-primary-foreground/50 hover:text-primary-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to review ${i + 1}`}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i === selectedIndex ? "bg-accent" : "bg-primary-foreground/25 hover:bg-primary-foreground/40",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next review"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/25 text-primary-foreground/70 transition-colors hover:border-primary-foreground/50 hover:text-primary-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
