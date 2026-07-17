import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleIcon, YelpIcon } from "@/components/site/BrandIcons";
import { getSiteSettings } from "@/lib/site.functions";

const REVIEWS = [
  {
    quote:
      "They diagnosed the issue with our Sub-Zero the same day, explained it clearly and charged exactly what they quoted. Rare care for high-end appliances.",
    author: "Placeholder Customer",
    area: "Staten Island",
  },
  {
    quote:
      "Our Viking range hadn't been the same for months. They rebuilt the ignition system and it now runs perfectly. Professional from start to finish.",
    author: "Placeholder Customer",
    area: "Brooklyn",
  },
  {
    quote:
      "Wolf double oven control board — replaced the same week, both cavities recalibrated. Communication was clear and the price matched the quote.",
    author: "Placeholder Customer",
    area: "Long Island",
  },
  {
    quote:
      "Thermador induction cooktop back to full function. Honest, transparent and thorough — exactly the service premium appliances deserve.",
    author: "Placeholder Customer",
    area: "Jersey City",
  },
];

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Customer Reviews | Best Sub-Zero & Viking Service NY & NJ" },
      {
        name: "description",
        content:
          "Read what customers say about our premium appliance repair service. Real feedback and Google reviews from Sub-Zero, Viking and Wolf owners across NY and NJ.",
      },
      { property: "og:title", content: "Customer Reviews" },
      { property: "og:description", content: "Feedback from NY & NJ customers." },
      { property: "og:url", content: "/reviews" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: Reviews,
});

function Reviews() {
  const { data: settings } = useQuery({ queryKey: ["site-settings"], queryFn: () => getSiteSettings() });
  const googleUrl = settings?.social_links?.google_reviews;
  const yelpUrl = settings?.social_links?.yelp;

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-20">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Customer <span className="text-accent">reviews</span></h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            We're proud of the reputation we've built repairing premium kitchen appliances across NY &amp; NJ.
          </p>

          {settings?.review_rating ? (
            <div className="mt-8 flex items-center gap-3">
              <div className="flex" aria-label={`${settings.review_rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.round(settings.review_rating!) ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {settings.review_rating.toFixed(1)} on Google
                {settings.review_count ? ` · ${settings.review_count} reviews` : ""}
              </span>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {googleUrl ? (
              <a href={googleUrl} target="_blank" rel="noreferrer noopener">
                <Button size="lg" variant="outline" className="gap-2 border-2">
                  <GoogleIcon className="h-5 w-5 flex-shrink-0" />
                  Read reviews on Google
                </Button>
              </a>
            ) : null}
            {yelpUrl ? (
              <a href={yelpUrl} target="_blank" rel="noreferrer noopener">
                <Button size="lg" variant="outline" className="gap-2 border-2">
                  <YelpIcon className="h-5 w-5 flex-shrink-0" />
                  Read reviews on Yelp
                </Button>
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="rounded-md border border-dashed border-accent/50 bg-accent/5 p-4 text-sm text-muted-foreground">
          The testimonials below are <strong>PLACEHOLDER — TO REPLACE WITH REAL GOOGLE REVIEWS</strong>.
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {REVIEWS.map((r, i) => (
            <blockquote key={i} className="rounded-lg border border-border bg-card p-6">
              <div className="flex" aria-hidden>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mt-4 text-base">&ldquo;{r.quote}&rdquo;</p>
              <footer className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
                {r.author} · {r.area}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}
