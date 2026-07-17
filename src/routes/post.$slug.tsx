import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS } from "@/lib/blog-data";
import { buildTitle, buildMetaDescription } from "@/lib/seo";

// A paragraph entry is treated as a subheading (not body copy) when it's
// short and doesn't end like a sentence — matches how the source articles
// were structured (headline, then alternating subheads / paragraphs).
function isHeading(s: string): boolean {
  const t = s.trim();
  return t.length > 0 && t.length < 100 && !/[.!]$/.test(t);
}

export const Route = createFileRoute("/post/$slug")({
  loader: ({ params }) => {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.post) {
      return { meta: [{ title: "Post not found" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    const title = buildTitle(post.title);
    const description = buildMetaDescription(post.metaDescription, post.paragraphs.join(" "));
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: post.title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/post/${post.slug}` },
        { property: "og:type", content: "article" },
        { property: "og:image", content: post.heroImage },
      ],
      links: [{ rel: "canonical", href: `/post/${post.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description,
            image: post.heroImage,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
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
      <Link to="/blog" className="mt-6 inline-flex text-accent hover:underline">Back to blog</Link>
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
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> All articles
          </Link>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">{post.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 md:px-8">
        <div className="overflow-hidden rounded-lg">
          <img
            src={post.heroImage}
            alt={post.title}
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </div>

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

        <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-center md:p-8">
          <h2 className="text-xl font-semibold tracking-tight">Ready to book a diagnostic?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Call now or send a request and we'll get back to you promptly.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="tel:+18887028565">
              <Button size="lg" className="gap-2">
                <Phone className="h-4 w-4" /> Call (888) 702-8565
              </Button>
            </a>
            <Link to="/contact">
              <Button size="lg" variant="outline">Request service</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
