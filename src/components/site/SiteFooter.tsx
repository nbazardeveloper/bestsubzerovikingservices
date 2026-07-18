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
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-12 px-4 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-[1.4fr_1fr_1fr_0.7fr]">
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
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Honest, expert repair for Sub-Zero, Viking, Wolf and other premium residential kitchen
            appliances, serving NY &amp; NJ.
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
          <h3 className="text-sm font-semibold tracking-wide text-foreground">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {s ? (
              <>
                <li className="min-w-0">
                  <a
                    href={`tel:${s.phone.replace(/[^+\d]/g, "")}`}
                    className="flex min-w-0 items-center gap-2 transition-colors hover:text-foreground"
                  >
                    <Phone className="h-4 w-4 flex-shrink-0" aria-hidden />
                    <span className="truncate">{s.phone}</span>
                  </a>
                </li>
                <li className="min-w-0">
                  <a
                    href={`mailto:${s.email}`}
                    className="flex min-w-0 items-center gap-2 transition-colors hover:text-foreground"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0" aria-hidden />
                    <span className="min-w-0 break-words">{s.email}</span>
                  </a>
                </li>
                {s.hours ? <li className="pt-1 text-xs leading-relaxed">{s.hours}</li> : null}
              </>
            ) : null}
            <li className="pt-1 text-xs font-medium text-foreground">
              24/7 online scheduling — service 7 days a week
            </li>
          </ul>
        </div>

        <div className="min-w-0 lg:hidden">
          <h3 className="text-sm font-semibold tracking-wide text-foreground">Service area</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            {AREAS.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-wide text-foreground">Site</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/services" className="transition-colors hover:text-foreground">
                All services
              </Link>
            </li>
            <li>
              <Link to="/projects" className="transition-colors hover:text-foreground">
                Recent projects
              </Link>
            </li>
            <li>
              <Link to="/reviews" className="transition-colors hover:text-foreground">
                Customer reviews
              </Link>
            </li>
            <li>
              <Link to="/blog" className="transition-colors hover:text-foreground">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/faq" className="transition-colors hover:text-foreground">
                Frequently asked questions
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="transition-colors hover:text-foreground">
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-wide text-foreground">Follow us</h3>
          <div className="mt-4 flex items-center gap-4 text-muted-foreground">
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
      </div>

      {/* Service area — its own full-width row on desktop only (the 8 areas
          didn't fit cleanly inside the narrow 4th grid column at the lg
          breakpoint); mobile/tablet keep the compact list in the grid above. */}
      <div className="hidden border-t border-border lg:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-5 text-sm text-muted-foreground md:px-8">
          <h3 className="text-sm font-semibold tracking-wide text-foreground">Service area</h3>
          {AREAS.map((a, i) => (
            <span key={a} className="flex items-center gap-6">
              {a}
              {i < AREAS.length - 1 ? (
                <span aria-hidden className="text-border">
                  ·
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>

      {/* Easy payment options — accepted payment methods, shown site-wide. */}
      <div className="border-t border-border bg-background/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-5 text-center md:flex-row md:justify-center md:gap-6 md:px-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
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
          compete with the hero/advantages sections for space. */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground md:px-8">
          {BRANDS.map((b, i) => (
            <span key={b} className="flex items-center gap-6">
              {b}
              {i < BRANDS.length - 1 ? (
                <span aria-hidden className="text-border">
                  ·
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-5 text-xs text-muted-foreground md:flex-row md:items-center md:px-8">
          <span>© {year} Best Sub-Zero &amp; Viking Service. All rights reserved.</span>
          <span>Residential appliance repair only.</span>
        </div>
      </div>

      {/* Trademark/affiliation disclaimer — required since we service these
          brands but have no corporate affiliation with them. */}
      <div className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-3 text-[11px] leading-relaxed text-muted-foreground md:px-8">
          Best Sub-Zero &amp; Viking Service is an independent service company. We specialize in the
          repair and maintenance of Sub-Zero, Viking and Wolf appliances, but we are not the
          manufacturer, an authorized dealer, or a factory-affiliated service center for these
          brands. All brand names, trademarks and logos are the property of their respective owners.
        </div>
      </div>

      {/* Required attribution for free-tier Noun Project icons used across
          the "Why choose us" and service-category icon sets. */}
      <div className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-3 text-[11px] leading-relaxed text-muted-foreground md:px-8">
          Icons by Puspito, metami septiana, miftahul huda, Graphixs_Art, Satria Arnata, Adi Waluyo
          Noto Carito, ATOM, Adnan Thariq, Larea, ic2icon, Cahya Kurniawan, Template, rendicon,
          Yosua Bungaran and wyasa design from{" "}
          <a
            href="https://thenounproject.com"
            target="_blank"
            rel="noreferrer noopener"
            className="underline hover:text-foreground"
          >
            the Noun Project
          </a>
          .
        </div>
      </div>
    </footer>
  );
}
