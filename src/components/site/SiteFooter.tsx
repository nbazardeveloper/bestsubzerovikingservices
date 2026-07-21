import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Instagram,
  Facebook,
  Youtube,
  Phone,
  Mail,
  Banknote,
  CreditCard,
  FileSignature,
  FileText,
} from "lucide-react";
import { GoogleIcon, YelpIcon } from "@/components/site/BrandIcons";
import { VenmoIcon, ZelleIcon } from "@/components/site/icons/PaymentIcons";
import { getSiteSettings } from "@/lib/site.functions";

const BRANDS = [
  "Sub-Zero",
  "Wolf",
  "Viking",
  "Thermador",
  "Bosch",
  "Dacor",
  "GE Monogram",
  "Bertazzoni",
];

const AREAS = [
  "Staten Island",
  "Brooklyn",
  "Queens",
  "Long Island (near Queens)",
  "Great Neck",
  "Jersey City",
  "Elizabeth, NJ",
  "North & Central NJ",
];

const PAYMENT_METHODS = [
  { label: "Cash", icon: Banknote },
  { label: "Credit cards", icon: CreditCard },
  { label: "Zelle", icon: ZelleIcon },
  { label: "Venmo", icon: VenmoIcon },
  { label: "Checks", icon: FileSignature },
  { label: "Invoices for regular clients", icon: FileText },
];

export function SiteFooter() {
  const { data: s } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
    staleTime: 5 * 60 * 1000,
  });
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-12 px-4 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.webp"
              alt=""
              width={395}
              height={420}
              className="h-10 w-auto flex-shrink-0"
            />
            <span className="text-sm font-semibold">Best Sub-Zero &amp; Viking Service</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-primary-foreground/70">
            Honest, expert repair for Sub-Zero, Viking, Wolf and other premium residential kitchen
            appliances, serving NY &amp; NJ. Residential appliance repair only.
          </p>
          {s?.social_links?.google_reviews || s?.social_links?.yelp ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {s.social_links.google_reviews ? (
                <a
                  href={s.social_links.google_reviews}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent"
                >
                  <GoogleIcon className="h-3.5 w-3.5 flex-shrink-0" /> Google Reviews
                </a>
              ) : null}
              {s.social_links.yelp ? (
                <a
                  href={s.social_links.yelp}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent"
                >
                  <YelpIcon className="h-3.5 w-3.5 flex-shrink-0" /> Yelp Reviews
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-wide text-primary-foreground">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/70">
            {s ? (
              <>
                <li className="min-w-0">
                  <a
                    href={`tel:${s.phone.replace(/[^+\d]/g, "")}`}
                    className="flex min-w-0 items-center gap-2 transition-colors hover:text-primary-foreground"
                  >
                    <Phone className="h-4 w-4 flex-shrink-0" aria-hidden />
                    <span className="truncate">{s.phone}</span>
                  </a>
                </li>
                <li className="min-w-0">
                  <a
                    href={`mailto:${s.email}`}
                    className="flex min-w-0 items-center gap-2 transition-colors hover:text-primary-foreground"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0" aria-hidden />
                    <span className="min-w-0 truncate text-xs">{s.email}</span>
                  </a>
                </li>
                {s.hours ? <li className="pt-1 text-xs leading-relaxed">{s.hours}</li> : null}
              </>
            ) : null}
            <li className="pt-1 text-xs font-medium text-primary-foreground">
              24/7 online scheduling — service 7 days a week
            </li>
          </ul>

          <h3 className="mt-6 text-sm font-semibold tracking-wide text-primary-foreground">
            Follow us
          </h3>
          <div className="mt-4 flex items-center gap-4 text-primary-foreground/70">
            {s?.social_links?.instagram ? (
              <a
                href={s.social_links.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="transition-colors hover:text-accent"
              >
                <Instagram className="h-[18px] w-[18px]" />
              </a>
            ) : null}
            {s?.social_links?.facebook ? (
              <a
                href={s.social_links.facebook}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Facebook"
                className="transition-colors hover:text-accent"
              >
                <Facebook className="h-[18px] w-[18px]" />
              </a>
            ) : null}
            {s?.social_links?.youtube ? (
              <a
                href={s.social_links.youtube}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="YouTube"
                className="transition-colors hover:text-accent"
              >
                <Youtube className="h-[18px] w-[18px]" />
              </a>
            ) : null}
          </div>
        </div>

        <div className="min-w-0 lg:hidden">
          <h3 className="text-sm font-semibold tracking-wide text-primary-foreground">
            Service area
          </h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-primary-foreground/70">
            {AREAS.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-wide text-primary-foreground">Site</h3>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
            <li>
              <Link to="/services" className="transition-colors hover:text-primary-foreground">
                All services
              </Link>
            </li>
            <li>
              <Link to="/projects" className="transition-colors hover:text-primary-foreground">
                Recent projects
              </Link>
            </li>
            <li>
              <Link to="/reviews" className="transition-colors hover:text-primary-foreground">
                Customer reviews
              </Link>
            </li>
            <li>
              <Link to="/blog" className="transition-colors hover:text-primary-foreground">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/faq" className="transition-colors hover:text-primary-foreground">
                Frequently asked questions
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="transition-colors hover:text-primary-foreground"
              >
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Service area — its own full-width row on desktop only (the 8 areas
          didn't fit cleanly inside the narrow 4th grid column at the lg
          breakpoint); mobile/tablet keep the compact list in the grid above. */}
      <div className="hidden border-t border-white/10 lg:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-5 text-sm text-primary-foreground/70 md:px-8">
          <h3 className="text-sm font-semibold tracking-wide text-primary-foreground">
            Service area
          </h3>
          {AREAS.map((a, i) => (
            <span key={a} className="flex items-center gap-6">
              {a}
              {i < AREAS.length - 1 ? (
                <span aria-hidden className="text-primary-foreground/20">
                  ·
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>

      {/* Easy payment options — accepted payment methods, shown site-wide. */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-5 text-center md:flex-row md:justify-center md:gap-6 md:px-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground">
            Easy payment options
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PAYMENT_METHODS.map(({ label, icon: Icon }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground"
              >
                <Icon className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Brands we service — moved here from the homepage so it doesn't
          compete with the hero/advantages sections for space. Animated as
          an infinite marquee (paused on hover); the sr-only list keeps the
          brand names readable to screen readers and search engines without
          announcing the duplicated scroll copy. */}
      <div className="border-t border-white/10 py-6">
        <span className="sr-only">Brands we service: {BRANDS.join(", ")}</span>
        <div className="marquee-edge-fade overflow-hidden" aria-hidden="true">
          <div className="animate-marquee flex w-max items-center">
            {[0, 1].map((rep) => (
              <div key={rep} className="flex items-center">
                {BRANDS.map((b) => (
                  <span key={`${rep}-${b}`} className="flex items-center gap-3 px-6">
                    <span className="font-display text-lg font-semibold tracking-tight text-primary-foreground whitespace-nowrap md:text-xl">
                      {b}
                    </span>
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-primary-foreground/60 md:px-8">
          <span>
            © {year} Best Sub-Zero &amp; Viking Service. All rights reserved. Independent Sub-Zero
            Appliance Care | Not Affiliated with SUB-ZERO GROUP INC.
          </span>
        </div>
      </div>
    </footer>
  );
}
