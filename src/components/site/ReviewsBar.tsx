import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoogleIcon, YelpIcon } from "@/components/site/BrandIcons";
import { getSiteSettings } from "@/lib/site.functions";

function Stars({ rating, dark }: { rating: number; dark?: boolean }) {
  return (
    <div className="flex" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < Math.round(rating)
              ? "fill-accent text-accent"
              : dark
                ? "text-white/30"
                : "text-border",
          )}
        />
      ))}
    </div>
  );
}

interface Props {
  className?: string;
  /** Use "dark" when dropping this into a dark-background block (e.g. the testimonial section). */
  variant?: "light" | "dark";
}

// A compact row of review-platform links meant to slot INTO an existing card
// or section (hero, testimonial block, contact sidebar) rather than stand
// alone as its own section. Shows a real star average/count only when the
// admin has entered one; otherwise it's still a clean, clickable badge.
export function ReviewsBar({ className, variant = "light" }: Props) {
  const dark = variant === "dark";
  const { data: s } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
    staleTime: 5 * 60 * 1000,
  });
  const googleUrl = s?.social_links?.google_reviews;
  const yelpUrl = s?.social_links?.yelp;
  if (!googleUrl && !yelpUrl) return null;

  const pillClass = cn(
    "inline-flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors",
    dark
      ? "border-white/20 bg-white/5 hover:bg-white/10"
      : "border-border bg-card hover:border-accent",
  );

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {googleUrl ? (
        <a href={googleUrl} target="_blank" rel="noreferrer noopener" className={pillClass}>
          <GoogleIcon className="h-5 w-5 flex-shrink-0" />
          {s?.review_rating ? (
            <span className="flex items-center gap-1.5">
              <Stars rating={s.review_rating} dark={dark} />
              <span className={cn("text-xs font-medium", dark ? "text-white" : "text-foreground")}>
                {s.review_rating.toFixed(1)}
                {s.review_count ? ` (${s.review_count})` : ""}
              </span>
            </span>
          ) : (
            <span className={cn("text-xs font-medium", dark ? "text-white" : "text-foreground")}>
              Google Reviews
            </span>
          )}
        </a>
      ) : null}
      {yelpUrl ? (
        <a href={yelpUrl} target="_blank" rel="noreferrer noopener" className={pillClass}>
          <YelpIcon className="h-5 w-5 flex-shrink-0" />
          {s?.yelp_review_rating ? (
            <span className="flex items-center gap-1.5">
              <Stars rating={s.yelp_review_rating} dark={dark} />
              <span className={cn("text-xs font-medium", dark ? "text-white" : "text-foreground")}>
                {s.yelp_review_rating.toFixed(1)}
                {s.yelp_review_count ? ` (${s.yelp_review_count})` : ""}
              </span>
            </span>
          ) : (
            <span className={cn("text-xs font-medium", dark ? "text-white" : "text-foreground")}>
              Yelp Reviews
            </span>
          )}
        </a>
      ) : null}
    </div>
  );
}
