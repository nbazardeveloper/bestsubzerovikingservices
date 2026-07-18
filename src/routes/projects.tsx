import { createFileRoute, Link } from "@tanstack/react-router";
import { absUrl } from "@/lib/seo";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { MapPin, Images } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { listProjects } from "@/lib/site.functions";

const COMPLETED_JOBS_MAP_URL =
  "https://www.google.com/maps/d/u/0/viewer?mid=1KRsUeTkfj5YfyxZIZ93085Ynm4D4Cz0&ll=40.63165163668629%2C-74.13427010000002&z=10";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Recent Repair Projects | Sub-Zero, Viking & Wolf | NY & NJ" },
      {
        name: "description",
        content:
          "A sample of premium appliance repair projects completed for customers across Staten Island, Brooklyn, Long Island near Queens and New Jersey by our repair specialists.",
      },
      { property: "og:title", content: "Recent Repair Projects" },
      {
        property: "og:description",
        content: "Sub-Zero, Viking, Wolf and Thermador projects we've completed.",
      },
      { property: "og:url", content: absUrl("/projects") },
    ],
    links: [{ rel: "canonical", href: absUrl("/projects") }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({ queryKey: ["projects"], queryFn: () => listProjects() }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => listProjects(),
  });
  const [brand, setBrand] = useState<string | null>(null);
  const brands = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.brands))).sort(),
    [projects],
  );
  const filtered = brand ? projects.filter((p) => p.brands.includes(brand)) : projects;

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Recent <span className="text-accent">projects</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            A snapshot of repairs we've completed. Every job starts with an accurate diagnostic and
            a transparent estimate.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <a
              href={COMPLETED_JOBS_MAP_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
            >
              <MapPin className="h-4 w-4" aria-hidden /> View our completed jobs map
            </a>
            <Link
              to="/projects/gallery"
              title="Photo gallery"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-accent"
            >
              <Images className="h-4 w-4" aria-hidden />
              <span className="sr-only">Photo gallery</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={brand === null ? "default" : "outline"}
            onClick={() => setBrand(null)}
          >
            All brands
          </Button>
          {brands.map((b) => (
            <Button
              key={b}
              size="sm"
              variant={brand === b ? "default" : "outline"}
              onClick={() => setBrand(b)}
            >
              {b}
            </Button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <article
              key={p.id}
              id={p.slug}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <ImagePlaceholder
                aspect="video"
                label={p.title}
                src={p.image_urls?.[0]}
                alt={`${p.title} — completed appliance repair project`}
              />
              <div className="p-5">
                <div className="flex flex-wrap gap-1">
                  {p.brands.map((b) => (
                    <Badge key={b} variant="secondary" className="font-normal">
                      {b}
                    </Badge>
                  ))}
                  {p.service_area ? (
                    <Badge variant="outline" className="font-normal">
                      {p.service_area}
                    </Badge>
                  ) : null}
                </div>
                <h2 className="mt-3 text-lg font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
