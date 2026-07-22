import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/site.functions";
import { buildTitle, buildMetaDescription, absUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { FinalCta } from "@/components/site/FinalCta";

// A paragraph entry is treated as a subheading (not body copy) when it's
// short and doesn't end like a sentence — matches how the source articles
// were structured (headline, then alternating subheads / paragraphs).
function isHeading(s: string): boolean {
  const t = s.trim();
  return t.length > 0 && t.length < 100 && !/[.!]$/.test(t);
}

export const Route = createFileRoute("/post/$slug")({
  loader: async ({ params }) => {
    const post = await getBlogPostBySlug({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.post) {
      return { meta: [{ title: "Post not found" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    const title = buildTitle(post.title);
    const description = buildMetaDescription(post.meta_description, post.paragraphs.join(" "));
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: post.title },
        { property: "og:description", content: description },
        { property: "og:url", content: absUrl(`/post/${post.slug}`) },
        { property: "og:type", content: "article" },
        { property: "og:image", content: post.hero_image ?? DEFAULT_OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: absUrl(`/post/${post.slug}`) }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description,
            ...(post.hero_image ? { image: post.hero_image } : {}),
            datePublished: post.published_at,
            dateModified: post.published_at,
            author: { "@type": "Organization", name: "Best Sub-Zero & Viking Service" },
            publisher: {
              "@type": "Organization",
              name: "Best Sub-Zero & Viking Service",
              logo: { "@type": "ImageObject", url: "/favicon.ico" },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": `/post/${post.slug}` },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">Post not found</h1>
      <p className="mt-3 text-muted-foreground">This article doesn't exist or has been moved.</p>
      <Link to="/blog" className="mt-6 inline-flex text-accent hover:underline">
        Back to blog
      </Link>
    </div>
  ),
  component: PostDetail,
});

function PostDetail() {
  const { post } = Route.useLoaderData();

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-14 md:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> All articles
          </Link>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">{post.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {new Date(post.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 md:px-8">
        {post.hero_image ? (
          <div className="overflow-hidden rounded-lg">
            <img
              src={post.hero_image}
              alt={post.title}
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        ) : null}

        <div className="prose prose-neutral mt-10 max-w-none text-base leading-relaxed text-foreground">
          {post.paragraphs.map((para, i) =>
            isHeading(para) ? (
              <h2 key={i} className="mt-8 text-xl font-semibold tracking-tight md:text-2xl">
                {para}
              </h2>
            ) : (
              <p key={i} className="mt-4">
                {para}
              </p>
            ),
          )}
        </div>
      </section>

      <FinalCta
        heading="Ready to book a diagnostic?"
        subtitle="Call now or send a request and we'll get back to you promptly."
      />
    </div>
  );
}
