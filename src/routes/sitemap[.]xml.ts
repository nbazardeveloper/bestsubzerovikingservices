import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { DB_STUBBED, mockServices, mockProjects, mockBlogPosts } from "@/lib/db-stub";

// Sitemap URLs must be absolute per the sitemap protocol. Falls back to the
// production domain if SITE_URL isn't set in the environment.
const BASE_URL = process.env.SITE_URL || "https://bestsubzerovikingservices.com";

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" as const },
  { path: "/services", priority: "0.9", changefreq: "weekly" as const },
  { path: "/projects", priority: "0.8", changefreq: "weekly" as const },
  { path: "/service-area", priority: "0.8", changefreq: "monthly" as const },
  { path: "/about", priority: "0.7", changefreq: "monthly" as const },
  { path: "/reviews", priority: "0.7", changefreq: "monthly" as const },
  { path: "/blog", priority: "0.7", changefreq: "weekly" as const },
  { path: "/faq", priority: "0.7", changefreq: "monthly" as const },
  { path: "/contact", priority: "0.9", changefreq: "monthly" as const },
  { path: "/privacy-policy", priority: "0.3", changefreq: "yearly" as const },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        let services: { slug: string }[] = [];
        let projects: { slug: string }[] = [];
        let posts: { slug: string }[] = [];

        if (DB_STUBBED) {
          services = mockServices.filter((s) => s.is_published).map((s) => ({ slug: s.slug }));
          projects = mockProjects.filter((p) => p.is_published).map((p) => ({ slug: p.slug }));
          posts = mockBlogPosts.filter((p) => p.is_published).map((p) => ({ slug: p.slug }));
        } else {
          const url = process.env.SUPABASE_URL!;
          const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
          const s = createClient<Database>(url, key, {
            auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
          });
          const [{ data: svc }, { data: proj }, { data: blog }] = await Promise.all([
            s.from("services").select("slug").eq("is_published", true),
            s.from("projects").select("slug").eq("is_published", true),
            s.from("blog_posts").select("slug").eq("is_published", true),
          ]);
          services = svc ?? [];
          projects = proj ?? [];
          posts = blog ?? [];
        }

        const urls = [
          ...STATIC_ROUTES.map((r) => ({
            loc: r.path,
            priority: r.priority,
            changefreq: r.changefreq,
          })),
          ...services.map((r) => ({
            loc: `/services/${r.slug}`,
            priority: "0.7",
            changefreq: "monthly" as const,
          })),
          ...projects.map((r) => ({
            loc: `/projects#${r.slug}`,
            priority: "0.5",
            changefreq: "monthly" as const,
          })),
          ...posts.map((p) => ({
            loc: `/post/${p.slug}`,
            priority: "0.6",
            changefreq: "monthly" as const,
          })),
        ];

        const body = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls.map(
            (u) =>
              `  <url><loc>${BASE_URL}${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
          ),
          "</urlset>",
        ].join("\n");

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
