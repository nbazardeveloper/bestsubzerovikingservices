import { createFileRoute, Link } from "@tanstack/react-router";
import { absUrl } from "@/lib/seo";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { listServices } from "@/lib/site.functions";
import { getServiceIcon, getServiceCategoryIconClassName } from "@/lib/service-category-icons";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Appliance Repair Services | Sub-Zero, Viking & Wolf Experts" },
      {
        name: "description",
        content:
          "Refrigerator, range, oven, cooktop, wine cooler, ice maker and ventilation repair for Sub-Zero, Viking, Wolf, Thermador and other premium brands in NY and NJ.",
      },
      { property: "og:title", content: "Premium Appliance Repair Services" },
      { property: "og:description", content: "All services we offer across NY & NJ." },
      { property: "og:url", content: absUrl("/services") },
    ],
    links: [{ rel: "canonical", href: absUrl("/services") }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({ queryKey: ["services"], queryFn: () => listServices() }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: () => listServices(),
  });
  const [brand, setBrand] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const allBrands = useMemo(
    () => Array.from(new Set(services.flatMap((s) => s.brands))).sort(),
    [services],
  );
  const allCategories = useMemo(
    () => Array.from(new Set(services.map((s) => s.category))).sort(),
    [services],
  );

  const filtered = services.filter(
    (s) => (!brand || s.brands.includes(brand)) && (!category || s.category === category),
  );

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Services</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            We repair premium residential kitchen appliances with a focus on Sub-Zero, Viking and
            Wolf, and also service other high-end brands including Thermador, Bosch, Dacor, GE
            Monogram and Bertazzoni.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            We do not service LG, Samsung or Liebherr refrigerators, and we do not repair
            dishwashers, washing machines or dryers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground mr-2 self-center">
              Brand:
            </span>
            <Button
              size="sm"
              variant={brand === null ? "default" : "outline"}
              onClick={() => setBrand(null)}
            >
              All
            </Button>
            {allBrands.map((b) => (
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
          <div className="flex flex-wrap gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground mr-2 self-center">
              Category:
            </span>
            <Button
              size="sm"
              variant={category === null ? "default" : "outline"}
              onClick={() => setCategory(null)}
            >
              All
            </Button>
            {allCategories.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={category === c ? "default" : "outline"}
                onClick={() => setCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const CategoryIcon = getServiceIcon(s);
            return (
              <div
                key={s.id}
                className="relative flex flex-col rounded-lg border border-border bg-card"
              >
                <div className="relative">
                  <ImagePlaceholder
                    aspect="square"
                    label={s.title}
                    src={s.image_url}
                    alt={`${s.title} — professional appliance repair service`}
                    className="rounded-b-none"
                  />
                  <div className="absolute -bottom-8 left-6 flex h-20 w-20 items-center justify-center rounded-lg border border-border bg-card shadow-sm">
                    <CategoryIcon
                      className={`${getServiceCategoryIconClassName(s.category)} text-foreground`}
                      aria-hidden
                    />
                    <span
                      aria-hidden
                      className="absolute -bottom-1 h-0.5 w-8 rounded-full bg-accent"
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6 pb-8 pt-14">
                  <div className="flex flex-wrap gap-1">
                    {s.brands.slice(0, 3).map((b) => (
                      <Badge key={b} variant="secondary" className="font-normal">
                        {b}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="mt-3 text-lg font-semibold">{s.title}</h2>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.short_description}</p>
                </div>
                <Link
                  to="/contact"
                  className="absolute -bottom-5 left-6 inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 font-display text-sm font-bold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
                >
                  Request Service
                </Link>
              </div>
            );
          })}
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No services match the current filters.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
