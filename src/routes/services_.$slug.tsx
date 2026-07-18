import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Phone, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { getServiceBySlug, listServices, getSiteSettings } from "@/lib/site.functions";
import { buildTitle, buildMetaDescription, absUrl } from "@/lib/seo";

const AREAS = [
  "Staten Island",
  "Brooklyn",
  "Queens",
  "Long Island (near Queens)",
  "Great Neck",
  "Jersey City",
  "Elizabeth, NJ",
  "North & Central NJ",
];

// Trailing-underscore filename ("services_.$slug") opts this route OUT of
// TanStack Router's dot-based nesting under services.tsx. Without it, this
// route is a *child* of /services, which means the router expects
// services.tsx's component to render an <Outlet/> for it — it doesn't (it's
// a self-contained listing page), so /services/some-slug would silently
// render the listing page only, never this detail page. Same bug, same fix
// as projects_.gallery.tsx.
export const Route = createFileRoute("/services_/$slug")({
  loader: async ({ context, params }) => {
    const service = await context.queryClient.ensureQueryData({
      queryKey: ["service", params.slug],
      queryFn: () => getServiceBySlug({ data: { slug: params.slug } }),
    });
    if (!service) throw notFound();
    await context.queryClient.ensureQueryData({
      queryKey: ["services"],
      queryFn: () => listServices(),
    });
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.service) {
      return { meta: [{ title: "Service not found" }, { name: "robots", content: "noindex" }] };
    }
    const s = loaderData.service;
    const title = buildTitle(s.title);
    const description = buildMetaDescription(s.short_description, s.description);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: s.title },
        { property: "og:description", content: description },
        { property: "og:url", content: absUrl(`/services/${s.slug}`) },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: absUrl(`/services/${s.slug}`) }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.title,
            serviceType: s.category,
            description: s.description,
            provider: {
              "@type": "LocalBusiness",
              name: "Best Sub-Zero & Viking Service",
              telephone: "+1-888-702-8565",
            },
            areaServed: AREAS,
            brand: s.brands.map((b) => ({ "@type": "Brand", name: b })),
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">Service not found</h1>
      <p className="mt-3 text-muted-foreground">
        This service page doesn't exist or has been removed.
      </p>
      <Link to="/services" className="mt-6 inline-flex text-accent hover:underline">
        Back to services
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">Couldn't load this service</h1>
      <p className="mt-3 text-muted-foreground">Please try again shortly.</p>
    </div>
  ),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { data: service } = useQuery({
    queryKey: ["service", slug],
    queryFn: () => getServiceBySlug({ data: { slug } }),
  });
  const { data: all = [] } = useQuery({ queryKey: ["services"], queryFn: () => listServices() });
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
  });
  if (!service) return null;

  const related = all
    .filter((s) => s.slug !== service.slug && s.category === service.category)
    .slice(0, 3);
  const phone = settings?.phone ?? "+1 (888) 702-8565";
  const telHref = `tel:${phone.replace(/[^+\d]/g, "")}`;

  // Every service title ends in its category keyword ("... Repair" /
  // "... Diagnostics") — accent-color just that last word to match the
  // site-wide heading treatment without hardcoding per-service text.
  const titleParts = service.title.split(" ");
  const titleLastWord = titleParts.pop();
  const titleRest = titleParts.join(" ");

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> All services
          </Link>
          <div className="mt-6 grid gap-10 md:grid-cols-2">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-accent">
                {service.category}
              </span>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                {titleRest} <span className="text-accent">{titleLastWord}</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">{service.short_description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {service.brands.map((b) => (
                  <Badge key={b} variant="secondary" className="font-normal">
                    {b}
                  </Badge>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={telHref}>
                  <Button size="lg" className="gap-2">
                    <Phone className="h-4 w-4" /> Call {phone}
                  </Button>
                </a>
                <Link to="/contact">
                  <Button size="lg" variant="outline">
                    Request service
                  </Button>
                </Link>
              </div>
            </div>
            <ImagePlaceholder
              aspect="video"
              label={service.title}
              src={service.image_url}
              alt={`${service.title} — appliance repair by Best Sub-Zero & Viking Service`}
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <div className="prose prose-neutral max-w-none text-base leading-relaxed text-foreground">
          <p>{service.description}</p>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Areas we <span className="text-accent">cover</span>
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
            {AREAS.map((a) => (
              <li key={a} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden /> {a}
              </li>
            ))}
          </ul>
          <Link to="/service-area" className="mt-6 inline-flex text-sm text-accent hover:underline">
            See full service area →
          </Link>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Related <span className="text-accent">services</span>
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                to="/services/$slug"
                params={{ slug: r.slug }}
                className="group overflow-hidden rounded-lg border border-border bg-card"
              >
                <ImagePlaceholder
                  aspect="video"
                  label={r.title}
                  src={r.image_url}
                  alt={`${r.title} — related appliance repair service`}
                />
                <div className="p-5">
                  <h3 className="text-base font-semibold">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.short_description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
