import { createFileRoute, Link } from "@tanstack/react-router";
import { absUrl } from "@/lib/seo";
import { useQuery } from "@tanstack/react-query";
import { listBlogPosts } from "@/lib/site.functions";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Appliance Repair Blog | Sub-Zero, Viking & Wolf Tips" },
      {
        name: "description",
        content:
          "Guides and tips on Sub-Zero, Viking and Wolf appliance repair — diagnostics, common problems, costs and what to expect, for homeowners in NY and NJ.",
      },
      { property: "og:title", content: "Appliance Repair Blog" },
      { property: "og:description", content: "Sub-Zero, Viking and Wolf repair guides and tips." },
      { property: "og:url", content: absUrl("/blog") },
    ],
    links: [{ rel: "canonical", href: absUrl("/blog") }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["blog-posts"],
      queryFn: () => listBlogPosts(),
    }),
  component: BlogIndex,
});

function BlogIndex() {
  const { data: posts = [] } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: () => listBlogPosts(),
  });

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Blog</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Guides, diagnostics and tips for owners of Sub-Zero, Viking and Wolf appliances across
            NY &amp; NJ.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              to="/post/$slug"
              params={{ slug: p.slug }}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
            >
              <div className="aspect-video overflow-hidden bg-steel">
                <img
                  src={p.hero_image ?? undefined}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {new Date(p.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <h2 className="mt-2 text-lg font-semibold leading-snug">{p.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">
                  {p.meta_description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-accent">
                  {p.title} — read more
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
