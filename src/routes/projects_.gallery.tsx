import { createFileRoute, Link } from "@tanstack/react-router";
import { absUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listProjects } from "@/lib/site.functions";

export const Route = createFileRoute("/projects_/gallery")({
  head: () => ({
    meta: [
      { title: "Project Photo Gallery | Sub-Zero, Viking & Wolf | NY & NJ" },
      {
        name: "description",
        content:
          "Photos from appliance repair projects completed across Staten Island, Brooklyn, Long Island near Queens and New Jersey.",
      },
      { property: "og:title", content: "Project Photo Gallery" },
      {
        property: "og:description",
        content: "Photos from appliance repair projects we've completed.",
      },
      { property: "og:url", content: absUrl("/projects/gallery") },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: absUrl("/projects/gallery") }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({ queryKey: ["projects"], queryFn: () => listProjects() }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => listProjects(),
  });
  const [brand, setBrand] = useState<string | null>(null);
  const brands = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.brands))).sort(),
    [projects],
  );

  const photos = useMemo(() => {
    const filteredProjects = brand ? projects.filter((p) => p.brands.includes(brand)) : projects;
    return filteredProjects.flatMap((p) =>
      (p.image_urls ?? []).map((url, i) => ({
        key: `${p.id}-${i}`,
        url,
        alt: `${p.title} — completed appliance repair project`,
      })),
    );
  }, [projects, brand]);

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to projects
          </Link>

          <div className="mt-6 flex flex-wrap gap-2">
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
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <div key={photo.key} className="aspect-square overflow-hidden rounded-lg bg-steel">
              <img
                src={photo.url}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
