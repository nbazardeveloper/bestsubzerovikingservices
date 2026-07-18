import { createFileRoute, Link } from "@tanstack/react-router";
import { absUrl } from "@/lib/seo";
import { MapPin } from "lucide-react";

const AREAS = [
  {
    name: "Staten Island",
    blurb:
      "Our home base. We know Staten Island neighborhoods and can typically reach customers same day when schedules allow.",
  },
  {
    name: "Brooklyn",
    blurb:
      "Regular routes throughout Brooklyn, from brownstones to modern condos with built-in Sub-Zero and Wolf.",
  },
  {
    name: "Queens",
    blurb:
      "Coverage across Queens for premium refrigeration, ranges and ovens in single-family and multi-family homes.",
  },
  {
    name: "Long Island",
    blurb: "Nassau and western Suffolk coverage for Sub-Zero, Viking and Wolf installations.",
  },
  {
    name: "Great Neck",
    blurb: "Frequent service in Great Neck and surrounding North Shore communities.",
  },
  {
    name: "Jersey City",
    blurb: "High-rise and townhouse service across Jersey City for premium residential kitchens.",
  },
  {
    name: "Elizabeth, NJ",
    blurb: "Serving Elizabeth NJ homeowners for repair and preventive maintenance.",
  },
  {
    name: "North & Central NJ",
    blurb:
      "Broader coverage across North and Central New Jersey for high-end residential appliances.",
  },
];

export const Route = createFileRoute("/service-area")({
  head: () => ({
    meta: [
      { title: "Service Area | Sub-Zero & Viking Repair Coverage in NY & NJ" },
      {
        name: "description",
        content:
          "We repair premium kitchen appliances in Staten Island, Brooklyn, Queens, Long Island, Great Neck, Jersey City, Elizabeth NJ, and North and Central New Jersey.",
      },
      { property: "og:title", content: "Service Area" },
      { property: "og:description", content: "Where we repair premium kitchen appliances." },
      { property: "og:url", content: absUrl("/service-area") },
    ],
    links: [{ rel: "canonical", href: absUrl("/service-area") }],
  }),
  component: ServiceArea,
});

function ServiceArea() {
  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Service <span className="text-accent">area</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            We serve homeowners across the New York metro and Northern &amp; Central New Jersey.
            Same-day service depends on technician availability — we'll tell you honestly when we
            can be there.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((a) => (
            <div key={a.name} className="rounded-lg border border-border bg-card p-6">
              <MapPin className="h-5 w-5 text-accent" aria-hidden />
              <h2 className="mt-4 text-lg font-semibold">{a.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{a.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Our completed <span className="text-accent">jobs</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            A real map of repairs we've completed across the New York metro and New Jersey —
            centered on Staten Island, radiating out through the service area above.
          </p>
          <div className="mt-8 overflow-hidden rounded-lg border border-border">
            <iframe
              title="Map of completed appliance repair jobs"
              src="https://www.google.com/maps/d/embed?mid=1KRsUeTkfj5YfyxZIZ93085Ynm4D4Cz0&ll=40.63165163668629%2C-74.13427010000002&z=10"
              width="100%"
              height="480"
              className="border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            <a
              href="https://www.google.com/maps/d/u/0/viewer?mid=1KRsUeTkfj5YfyxZIZ93085Ynm4D4Cz0&ll=40.63165163668629%2C-74.13427010000002&z=10"
              target="_blank"
              rel="noreferrer noopener"
              className="text-accent hover:underline"
            >
              Open the full map
            </a>{" "}
            · Not sure if we cover your address?{" "}
            <Link to="/contact" className="text-accent hover:underline">
              Send us a request
            </Link>{" "}
            and we'll confirm.
          </p>
        </div>
      </section>
    </div>
  );
}
