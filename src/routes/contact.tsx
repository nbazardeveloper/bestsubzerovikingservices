import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Phone, Mail, MessageCircle, MapPin, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuaranteeBadge } from "@/components/site/GuaranteeBadge";
import { ReviewsBar } from "@/components/site/ReviewsBar";
import { getSiteSettings } from "@/lib/site.functions";

const AREAS = [
  "Staten Island", "Brooklyn", "Queens", "Long Island", "Great Neck", "Jersey City", "Elizabeth, NJ", "North & Central NJ",
];

const BOOKING_URL = "https://api.prosbuddy.com/widget/bookings/now-schedule-service";
const BUSINESS_ADDRESS = "23 Joel Pl, Staten Island, NY 10306";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | Appliance Repair NY & NJ | (888) 702-8565" },
      {
        name: "description",
        content:
          "Call (888) 702-8565 or request service online for premium appliance repair across Staten Island, Brooklyn, Queens, Long Island and North and Central NJ.",
      },
      { property: "og:title", content: "Contact Best Sub-Zero & Viking Service" },
      { property: "og:description", content: "Get in touch to schedule a diagnostic or repair." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Best Sub-Zero & Viking Service",
          telephone: "+1-888-702-8565",
          email: "info@bestsubzerovikingservices.com",
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            streetAddress: "23 Joel Pl",
            addressLocality: "Staten Island",
            addressRegion: "NY",
            postalCode: "10306",
            addressCountry: "US",
          },
          areaServed: AREAS,
        }),
      },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({ queryKey: ["site-settings"], queryFn: () => getSiteSettings() }),
  component: Contact,
});

function Contact() {
  const { data: s } = useQuery({ queryKey: ["site-settings"], queryFn: () => getSiteSettings() });
  const phone = s?.phone ?? "+1 (888) 702-8565";
  const digits = phone.replace(/[^+\d]/g, "");
  // WhatsApp stays on the original mobile line — toll-free numbers like
  // (888) 702-8565 generally can't run a WhatsApp Business account.
  const waDigits = "13476170717";

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Contact <span className="text-accent">us</span></h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Call, message on WhatsApp, or book online below. Please have your appliance's model number,
            serial number and a brief problem description ready.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[2fr_3fr] md:px-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-accent">Direct contact</h2>
            <div className="mt-4 grid gap-4">
              <a href={`tel:${digits}`}>
                <Button size="lg" className="w-full justify-start gap-3">
                  <Phone className="h-4 w-4" /> Call {phone}
                </Button>
              </a>
              <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noreferrer noopener">
                <Button size="lg" variant="outline" className="w-full justify-start gap-3">
                  <MessageCircle className="h-4 w-4" /> WhatsApp {phone}
                </Button>
              </a>
              {s?.email ? (
                <a href={`mailto:${s.email}`}>
                  <Button size="lg" variant="ghost" className="w-full justify-start gap-3">
                    <Mail className="h-4 w-4" /> {s.email}
                  </Button>
                </a>
              ) : null}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s?.address ?? BUSINESS_ADDRESS)}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-start gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" aria-hidden />
                {s?.address ?? BUSINESS_ADDRESS}
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-semibold">Business hours</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s?.hours ?? "Contact us for current hours."}</p>
            <h3 className="mt-6 text-sm font-semibold">Diagnostic fee</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {s?.diagnostic_fee ?? "$95, waived when the repair is completed."}
            </p>
            <h3 className="mt-6 text-sm font-semibold">Reviews</h3>
            <ReviewsBar className="mt-2" />
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-accent">Service area</h3>
            <ul className="mt-4 grid grid-cols-2 gap-1 text-sm text-muted-foreground">
              {AREAS.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden /> {a}
                </li>
              ))}
            </ul>
          </div>

          <GuaranteeBadge />
        </div>

        <div>
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Book your service</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pick a time that works for you — our online scheduler books your diagnostic appointment directly.
                </p>
              </div>
              <a href={BOOKING_URL} target="_blank" rel="noreferrer noopener" className="hidden sm:inline-flex">
                <Button variant="outline" className="gap-2">
                  <CalendarClock className="h-4 w-4" /> Open scheduler
                </Button>
              </a>
            </div>
            <div className="mt-6 overflow-hidden rounded-lg border border-border">
              <iframe
                title="Book a service appointment online"
                src={BOOKING_URL}
                width="100%"
                height="720"
                className="border-0"
                loading="lazy"
              />
            </div>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer noopener" className="mt-3 inline-flex text-sm text-accent hover:underline sm:hidden">
              Open the scheduler in a new tab →
            </a>
            <p className="mt-3 text-xs text-muted-foreground">
              Trouble loading the scheduler above?{" "}
              <a href={BOOKING_URL} target="_blank" rel="noreferrer noopener" className="text-accent hover:underline">
                Open it in a new tab
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
