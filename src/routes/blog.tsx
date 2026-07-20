import { createFileRoute } from "@tanstack/react-router";
import { absUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";

// The blog is published through Soro (trysoro.com) — new articles are
// written and auto-published by Soro directly into this embed, not through
// our own Supabase blog_posts table. That table/route (post.$slug.tsx) is
// leftover from before this switch; nothing links to it anymore, but it's
// left in place rather than deleted in case it's already indexed somewhere.
// See Soro's dashboard -> Settings -> Blog Widget -> Manage for this
// embed snippet (id/script pair are tied to this Soro account+site).
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
      { property: "og:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: absUrl("/blog") }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
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
        <div id="soro-blog" />
        <script
          src="https://app.trysoro.com/api/embed/dde6d064-824d-4996-93f6-494a8776867f"
          defer
        />
      </section>
    </div>
  );
}
