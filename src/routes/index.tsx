import { createFileRoute, Link } from "@tanstack/react-router";
import { absUrl } from "@/lib/seo";
import { useQuery } from "@tanstack/react-query";
import { Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { GuaranteeBadge } from "@/components/site/GuaranteeBadge";
import { AnniversaryBadge } from "@/components/site/AnniversaryBadge";
import { ReviewsBar } from "@/components/site/ReviewsBar";
import { SpecialistBrandsBand } from "@/components/site/SpecialistBrandsBand";
import { BrandsMarquee } from "@/components/site/BrandsMarquee";
import { TestimonialCarousel } from "@/components/site/TestimonialCarousel";
import { LazyYouTubeBackground } from "@/components/site/LazyYouTubeBackground";
import { FinalCta } from "@/components/site/FinalCta";
import { SITE_REVIEWS } from "@/lib/reviews-data";
import {
  YearsIcon,
  DiagnosticsIcon,
  PricingIcon,
  SameDayIcon,
  SchedulingIcon,
  WarrantyIcon,
} from "@/components/site/icons/WhyChooseIcons";
import { getServiceIcon, getServiceCategoryIconClassName } from "@/lib/service-category-icons";
import { listFeaturedServices, listFeaturedProjects, getSiteSettings } from "@/lib/site.functions";

const ADVANTAGES = [
  {
    icon: YearsIcon,
    title: "Proven Experience",
    body: "Insured & certified technicians servicing Sub-Zero, Wolf & Viking appliances across NY & NJ.",
  },
  {
    icon: DiagnosticsIcon,
    title: "Accurate Diagnostics",
    body: "We identify the real fault before quoting — no guesswork, no unnecessary parts.",
  },
  {
    icon: PricingIcon,
    title: "Transparent Pricing",
    body: "Before any repair, we explain all costs clearly. $95 diagnostic fee, waived when we complete the repair.",
  },
  {
    icon: SameDayIcon,
    title: "Urgent Repairs",
    body: "Fast response — same-day or next-day service available, depending on technician schedule and parts.",
  },
  {
    icon: SchedulingIcon,
    title: "24/7 Scheduling",
    body: "Book your appointment online any time — we provide service 7 days a week.",
  },
  {
    icon: WarrantyIcon,
    title: "Warranty on All Work",
    body: "Labor and parts are covered by warranty for 90 days to 6 months, depending on the repair.",
  },
];

const FAQ_PREVIEW = [
  {
    q: "Do you offer same-day service?",
    a: "Same-day service depends on technician availability that day.",
  },
  {
    q: "How much is the diagnostic fee?",
    a: "The diagnostic fee is $95 ($125 in Manhattan), waived when you complete the repair with us.",
  },
  {
    q: "Do you use OEM parts?",
    a: "We use OEM or manufacturer-approved parts whenever available.",
  },
];

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    const [, , settings] = await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["featured-services"],
        queryFn: () => listFeaturedServices(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["featured-projects"],
        queryFn: () => listFeaturedProjects(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["site-settings"],
        queryFn: () => getSiteSettings(),
      }),
    ]);
    return { settings };
  },
  head: ({ loaderData }) => {
    // Star-rating rich snippets in Google search results require an
    // aggregateRating on the LocalBusiness entity — we already collect
    // review_count/review_rating in site settings (shown on-site via
    // ReviewsBar) but weren't surfacing them to search engines at all.
    // Only include it once both values are actually set, so an empty/unset
    // admin field never emits a bogus "0 reviews" rating.
    const settings = loaderData?.settings;
    const aggregateRating =
      settings?.review_rating && settings?.review_count
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: settings.review_rating,
              reviewCount: settings.review_count,
            },
          }
        : {};

    return {
      meta: [
        { title: "Best Sub-Zero & Viking Service | NY & NJ Appliance Repair" },
        {
          name: "description",
          content:
            "Premium repair for Sub-Zero, Viking, Wolf and other high-end kitchen appliances across Staten Island, Brooklyn, Queens and New Jersey. Call today.",
        },
        { property: "og:title", content: "Best Sub-Zero & Viking Service" },
        {
          property: "og:description",
          content:
            "Honest, expert repair of premium residential kitchen appliances across NY & NJ.",
        },
        { property: "og:url", content: absUrl("/") },
        {
          property: "og:image",
          content: "https://bestsubzerovikingservices.com/images/hero.webp",
        },
      ],
      links: [{ rel: "canonical", href: absUrl("/") }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Best Sub-Zero & Viking Service",
            telephone: "+1-888-702-8565",
            email: "info@bestsubzerovikingservices.com",
            image: "https://bestsubzerovikingservices.com/images/hero.webp",
            priceRange: "$$",
            areaServed: [
              "Staten Island",
              "Brooklyn",
              "Queens",
              "Long Island (near Queens)",
              "Great Neck",
              "Jersey City",
              "Elizabeth NJ",
              "North & Central New Jersey",
            ],
            ...aggregateRating,
          }),
        },
      ],
    };
  },
  component: Home,
});

function Home() {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
  });
  const { data: featured = [] } = useQuery({
    queryKey: ["featured-services"],
    queryFn: () => listFeaturedServices(),
  });
  const { data: projects = [] } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: () => listFeaturedProjects(),
  });

  const phone = settings?.phone ?? "+1 (888) 702-8565";
  const telHref = `tel:${phone.replace(/[^+\d]/g, "")}`;

  return (
    <div>
      {/* HERO — full-bleed background image, no card behind the text. A left-side
          dark scrim (independent of how bright/dark the underlying photo is)
          plus a drop-shadow keeps white text reliably legible over any photo. */}
      <section className="relative isolate flex min-h-[480px] items-center overflow-hidden border-b border-border md:min-h-[560px] lg:min-h-[640px]">
        <ImagePlaceholder
          fill
          src="/images/heromobil.webp"
          desktopSrc="/images/hero.webp"
          label="Hero — premium kitchen"
          alt="Luxury kitchen with a built-in stainless steel refrigerator, professional range and blue accent lighting"
          priority
          className="-z-10"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/45 to-transparent md:from-black/70 md:via-black/25 md:to-transparent"
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="flex max-w-3xl flex-col">
            <span className="mx-auto inline-flex w-fit items-center whitespace-nowrap rounded-full border border-white/25 bg-black/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm sm:mx-0">
              Sub-Zero · Viking · Wolf specialists
            </span>
            <h1 className="mt-4 max-w-2xl text-balance text-4xl font-semibold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] md:text-5xl">
              Premium kitchen appliance repair, done right the first time.
            </h1>
            <p className="mt-5 max-w-xl text-base text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] md:text-lg">
              Accurate diagnostics, transparent pricing and long-lasting repairs for high-end
              residential appliances across New York and New Jersey.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={telHref}>
                <Button size="lg" className="gap-2 bg-white text-primary hover:bg-white/90">
                  <Phone className="h-4 w-4" /> Call {phone}
                </Button>
              </a>
              <Link to="/contact">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Request service
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
              $95 diagnostic fee —{" "}
              <span className="font-medium">waived when the repair is completed</span>.
            </p>
            <div className="mt-6 hidden sm:block">
              <GuaranteeBadge variant="dark" className="w-fit" />
            </div>
          </div>

          <AnniversaryBadge className="absolute bottom-4 right-4 hidden md:flex md:bottom-8 md:right-8" />
        </div>
      </section>

      <BrandsMarquee />

      <SpecialistBrandsBand />

      {/* WHY CHOOSE US / ADVANTAGES — diagonal two-tone panel adapted from the
          client reference, using real hero photography (clipped diagonally)
          instead of a stock technician/appliance composite. `will-change-transform`
          forces this clip-path panel onto its own compositor layer — without it,
          Chrome was occasionally reusing/ghosting a stale rasterized tile of this
          section's text into the sticky-header area for a frame right after an
          in-app navigation (reported as a "glitch strip" between the header and
          hero on the homepage). */}
      <section className="relative isolate overflow-hidden bg-background">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 hidden w-[44%] overflow-hidden shadow-[12px_0_30px_-8px_rgba(0,0,0,0.3)] [clip-path:polygon(0_0,100%_0,82%_100%,0_100%)] will-change-transform lg:block"
        >
          <ImagePlaceholder
            fill
            src="/images/hero-why-choose-us.webp"
            label="Premium kitchen appliance"
            alt=""
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
          <div className="max-w-md lg:max-w-lg lg:ml-auto xl:max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Why <span className="text-accent">choose</span> us
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              When your Sub-Zero, Wolf or Viking needs service, our technicians diagnose the real
              issue, explain your options clearly, and get it fixed right — the first time.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-7 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-8">
              {ADVANTAGES.map((a) => (
                <div key={a.title} className="flex items-start gap-3 lg:flex-col lg:gap-2">
                  <a.icon
                    className="h-8 w-8 flex-shrink-0 text-accent sm:h-10 sm:w-10 lg:h-11 lg:w-11"
                    aria-hidden
                  />
                  <div>
                    <p className="text-sm font-semibold leading-tight text-foreground sm:text-base">
                      {a.title}
                    </p>
                    <p className="mt-1 hidden text-sm text-muted-foreground sm:block">{a.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="flex items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Featured <span className="text-accent">services</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                From Sub-Zero built-ins to Viking ranges, we service the appliances that anchor your
                kitchen.
              </p>
            </div>
            <Link
              to="/services"
              className="hidden text-sm text-accent hover:underline md:inline-flex"
            >
              View all services →
            </Link>
          </div>
          <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => {
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
                      alt={`${s.title} — Sub-Zero & Viking appliance repair service`}
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
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">
                      {s.short_description}
                    </p>
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
          </div>
        </div>
      </section>

      {/* PROJECTS — gallery: a muted looping video reel up top, then a
          hover-reveal photo grid below (image zooms, title/brand slides up
          over a dark gradient) instead of plain cards with text underneath. */}
      {projects.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Recent <span className="text-accent">projects</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                A sample of repairs completed for customers across NY &amp; NJ.
              </p>
            </div>
            <Link
              to="/projects"
              className="hidden text-sm text-accent hover:underline md:inline-flex"
            >
              All projects →
            </Link>
          </div>

          <LazyYouTubeBackground
            videoId="t0z6O0nhGfY"
            title="Best Sub-Zero & Viking Service — recent work"
            className="relative mt-10 aspect-video overflow-hidden rounded-xl shadow-md"
          />

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                to="/projects"
                hash={p.slug}
                className="group relative block aspect-square overflow-hidden rounded-lg"
              >
                <ImagePlaceholder
                  fill
                  label={p.title}
                  src={p.image_urls?.[0]}
                  alt={`${p.title} — completed appliance repair project`}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90 transition-opacity group-hover:opacity-100"
                />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="text-xs uppercase tracking-widest text-white/70">
                    {p.brands.join(" · ")} · {p.service_area}
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-white">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* TESTIMONIAL */}
      <section className="relative isolate overflow-hidden border-y border-border text-primary-foreground">
        <ImagePlaceholder
          fill
          src="/images/hero-review.webp"
          label="Customer reviews"
          alt=""
          className="-z-10"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-primary/85" />

        <div className="mx-auto max-w-4xl px-4 py-20 text-center md:px-8">
          <p className="text-xs uppercase tracking-[0.25em] text-primary-foreground/60">
            Customer feedback
          </p>
          <TestimonialCarousel testimonials={SITE_REVIEWS} className="mt-6" />
          <ReviewsBar variant="dark" className="mt-10 justify-center" />
          <Link
            to="/reviews"
            className="mt-6 inline-flex text-sm text-accent-foreground underline underline-offset-4"
          >
            Read customer reviews →
          </Link>
        </div>
      </section>

      {/* SERVICE AREA */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Serving NY &amp; NJ <span className="text-accent">homes</span>
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              We're based in the New York metro and cover Staten Island, Brooklyn, Queens, Long
              Island near Queens, Great Neck, Jersey City, Elizabeth NJ and North &amp; Central New
              Jersey.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-2 text-sm">
              {[
                "Staten Island",
                "Brooklyn",
                "Queens",
                "Long Island (near Queens)",
                "Great Neck",
                "Jersey City",
                "Elizabeth, NJ",
                "North & Central NJ",
              ].map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden /> {a}
                </li>
              ))}
            </ul>
            <Link
              to="/service-area"
              className="mt-6 inline-flex text-sm text-accent hover:underline"
            >
              See full service area →
            </Link>
          </div>
          <div className="h-[420px] overflow-hidden rounded-lg border border-border md:h-[640px]">
            <iframe
              title="Map of completed appliance repair jobs across NY & NJ"
              src="https://www.google.com/maps/d/embed?mid=1KRsUeTkfj5YfyxZIZ93085Ynm4D4Cz0&ll=40.63165163668629%2C-74.13427010000002&z=10"
              width="100%"
              height="100%"
              className="border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* FAQ PREVIEW — same diagonal two-tone treatment as "Why choose us",
          mirrored so the photo panel sits on the right. Same will-change-transform
          fix as above (see comment there) for the same clip-path ghosting glitch. */}
      <section className="relative isolate overflow-hidden border-t border-border bg-background">
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 hidden w-[44%] overflow-hidden shadow-[-12px_0_30px_-8px_rgba(0,0,0,0.3)] [clip-path:polygon(100%_0,0_0,18%_100%,100%_100%)] will-change-transform lg:block"
        >
          <ImagePlaceholder
            fill
            src="/images/hero-FAQ.webp"
            label="Premium kitchen appliance"
            alt=""
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
          <div className="max-w-md lg:mr-auto">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Common <span className="text-accent">questions</span>
            </h2>
            <div className="mt-8 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
              {FAQ_PREVIEW.map((f) => (
                <div key={f.q} className="p-6">
                  <h3 className="text-base font-semibold">{f.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
            <Link to="/faq" className="mt-6 inline-flex text-sm text-accent hover:underline">
              Read all FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <FinalCta />
    </div>
  );
}
