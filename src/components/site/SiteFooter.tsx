import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Facebook, Youtube, Phone, Mail } from "lucide-react";
import { GoogleIcon, YelpIcon } from "@/components/site/BrandIcons";
import { getSiteSettings } from "@/lib/site.functions";

const BRANDS = ["Sub-Zero", "Wolf", "Viking", "Thermador", "Bosch", "Dacor", "GE Monogram", "Bertazzoni"];

const AREAS = [
  "Staten Island",
  "Brooklyn",
  "Queens",
  "Long Island",
  "Great Neck",
  "Jersey City",
  "Elizabeth, NJ",
  "North & Central NJ",
];

export function SiteFooter() {
  const { data: s } = useQuery({ queryKey: ["site-settings"], queryFn: () => getSiteSettings(), staleTime: 5 * 60 * 1000 });
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img src="/images/logo.webp" alt="Best Sub-Zero & Viking Service logo" className="h-10 w-10 flex-shrink-0" />
            <span className="text-sm font-semibold">Best Sub-Zero &amp; Viking Service</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Honest, expert repair for Sub-Zero, Viking, Wolf and other premium residential kitchen appliances. 13 years serving NY &amp; NJ.
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

        <div>
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {s ? (
              <>
                <li>
                  <a href={`tel:${s.phone.replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-2 hover:text-foreground">
                    <Phone className="h-4 w-4" aria-hidden /> {s.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${s.email}`} className="inline-flex items-center gap-2 hover:text-foreground">
                    <Mail className="h-4 w-4" aria-hidden /> {s.email}
                  </a>
                </li>
                {s.hours ? <li className="text-xs">{s.hours}</li> : null}
              </>
            ) : null}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Service area</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {AREAS.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Site</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-foreground">All services</Link></li>
            <li><Link to="/projects" className="hover:text-foreground">Recent projects</Link></li>
            <li><Link to="/reviews" className="hover:text-foreground">Customer reviews</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/faq" className="hover:text-foreground">Frequently asked questions</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-foreground">Privacy policy</Link></li>
          </ul>
          <div className="mt-5 flex items-center gap-3 text-muted-foreground">
            {s?.social_links?.instagram ? (
              <a href={s.social_links.instagram} target="_blank" rel="noreferrer noopener" aria-label="Instagram" className="hover:text-foreground">
                <Instagram className="h-4 w-4" />
              </a>
            ) : null}
            {s?.social_links?.facebook ? (
              <a href={s.social_links.facebook} target="_blank" rel="noreferrer noopener" aria-label="Facebook" className="hover:text-foreground">
                <Facebook className="h-4 w-4" />
              </a>
            ) : null}
            {s?.social_links?.youtube ? (
              <a href={s.social_links.youtube} target="_blank" rel="noreferrer noopener" aria-label="YouTube" className="hover:text-foreground">
                <Youtube className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {/* Brands we service — moved here from the homepage so it doesn't
          compete with the hero/advantages sections for space. */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground md:px-8">
          {BRANDS.map((b, i) => (
            <span key={b} className="flex items-center gap-6">
              {b}
              {i < BRANDS.length - 1 ? <span aria-hidden className="text-border">·</span> : null}
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

      {/* Required attribution for free-tier Noun Project icons used in the
          "Our Advantages" section. */}
      <div className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-3 text-[11px] leading-relaxed text-muted-foreground md:px-8">
          Icons by Puspito, metami septiana, miftahul huda and Graphixs_Art from{" "}
          <a href="https://thenounproject.com" target="_blank" rel="noreferrer noopener" className="underline hover:text-foreground">
            the Noun Project
          </a>
          .
        </div>
      </div>
    </footer>
  );
}
