import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { DB_STUBBED } from "@/lib/db-stub";

// ============================================================================
// Soro (trysoro.com) auto-publish webhook
// ============================================================================
// Configure this URL as a "custom webhook" integration in the Soro dashboard:
//   https://<your-domain>/api/soro-webhook
// and set the SORO_WEBHOOK_SECRET below as the shared secret/auth header Soro
// sends with each request.
//
// NOTE: Soro's exact payload field names weren't available without logging
// into the dashboard, so this handler accepts several common variants
// (title/slug/excerpt/content vs. seo_title/meta_description/content_html,
// etc.) and normalizes them. If real requests come through with different
// field names, check the payload shape in Soro's dashboard (or the request
// logs here) and adjust `normalizePayload` below.
// ============================================================================

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Soro (like most CMS/SEO tools) is likely to send article body as HTML.
// This app renders posts as plain paragraphs (see post.$slug.tsx), so we
// convert block-level HTML into an array of plain-text paragraphs/headings.
function htmlToParagraphs(html: string): string[] {
  const withBreaks = html
    .replace(/<\/(p|h1|h2|h3|h4|h5|h6|li|div)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n");
  const stripped = withBreaks.replace(/<[^>]+>/g, "");
  const decoded = stripped
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
  return decoded
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

type NormalizedPost = {
  slug: string;
  title: string;
  meta_description: string;
  hero_image: string | null;
  paragraphs: string[];
};

function normalizePayload(body: Record<string, unknown>): NormalizedPost | null {
  const title = (body.title ?? body.seo_title ?? body.headline) as string | undefined;
  if (!title || typeof title !== "string") return null;

  const slugRaw = (body.slug ?? body.url_slug ?? title) as string;
  const slug = slugify(String(slugRaw));
  if (!slug) return null;

  const metaDescription = (body.meta_description ??
    body.excerpt ??
    body.description ??
    body.seo_description ??
    "") as string;

  const heroImage = (body.featured_image ??
    body.image ??
    body.image_url ??
    body.hero_image ??
    null) as string | null;

  let paragraphs: string[] = [];
  if (Array.isArray(body.paragraphs)) {
    paragraphs = body.paragraphs.filter((p): p is string => typeof p === "string");
  } else {
    const contentHtml = (body.content_html ?? body.content ?? body.body ?? body.body_html) as
      string | undefined;
    if (typeof contentHtml === "string" && contentHtml.trim()) {
      paragraphs = htmlToParagraphs(contentHtml);
    }
  }

  return { slug, title, meta_description: metaDescription, hero_image: heroImage, paragraphs };
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/soro-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.SORO_WEBHOOK_SECRET;
        if (!expected) {
          console.error("[soro-webhook] SORO_WEBHOOK_SECRET is not set — rejecting request");
          return json({ error: "Webhook not configured" }, 503);
        }

        const provided =
          request.headers.get("x-webhook-secret") ??
          request.headers.get("x-soro-secret") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
          "";
        if (!provided || !timingSafeEqual(provided, expected)) {
          return json({ error: "Unauthorized" }, 401);
        }

        let body: Record<string, unknown>;
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid JSON body" }, 400);
        }

        const post = normalizePayload(body);
        if (!post) {
          return json({ error: "Payload missing a usable title" }, 400);
        }

        if (DB_STUBBED) {
          console.warn(
            "[soro-webhook] DB is stubbed — article received but NOT persisted:",
            post.slug,
          );
          return json({ ok: true, stubbed: true, slug: post.slug });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.from("blog_posts").upsert(
          {
            slug: post.slug,
            title: post.title,
            meta_description: post.meta_description || post.title,
            hero_image: post.hero_image,
            paragraphs: post.paragraphs,
            is_published: true,
            source: "soro",
            published_at: new Date().toISOString(),
          },
          { onConflict: "slug" },
        );
        if (error) {
          console.error("[soro-webhook] insert failed:", error.message);
          return json({ error: error.message }, 500);
        }

        return json({ ok: true, slug: post.slug });
      },
    },
  },
});
