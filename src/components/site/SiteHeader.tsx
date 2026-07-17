import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/site.functions";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/service-area", label: "Service Area" },
  { to: "/about", label: "About" },
  { to: "/reviews", label: "Reviews" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
    staleTime: 5 * 60 * 1000,
  });
  const phone = settings?.phone ?? "+1 (888) 702-8565";
  const telHref = `tel:${phone.replace(/[^+\d]/g, "")}`;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background">
      <div className="relative mx-auto flex h-24 max-w-7xl items-center justify-between gap-6 px-4 md:h-28 md:px-8">
        {/* Desktop logo — sized to visually span this row PLUS the CTA bar
            below it (168px = h-28 + h-14), so it overlaps both. Positioned
            absolutely and pulled above the CTA bar with z-index. */}
        <Link
          to="/"
          aria-label="Best Sub-Zero & Viking Service — home"
          className="h-header-logo absolute left-4 top-0 z-30 hidden md:flex md:items-center lg:left-8"
        >
          <img
            src="/images/logo.webp"
            alt="Best Sub-Zero & Viking Service logo"
            className="h-full w-auto flex-shrink-0 py-3 drop-shadow-sm"
          />
        </Link>

        {/* Mobile logo — no CTA bar on mobile, so a normal small logo is fine. */}
        <Link to="/" className="flex items-center gap-3 md:hidden" aria-label="Best Sub-Zero & Viking Service — home">
          <img src="/images/logo.webp" alt="Best Sub-Zero & Viking Service logo" className="h-12 w-12 flex-shrink-0" />
          <span className="text-base font-semibold tracking-tight">Best Sub-Zero &amp; Viking Service</span>
        </Link>

        {/* Business name/tagline — pushed right to clear the big logo. Hidden
            once the full nav takes over (xl+) so the 9 nav items get the
            whole row instead of fighting the name text for space. */}
        <div className="hidden flex-col leading-tight md:ml-40 md:flex lg:ml-44 xl:hidden">
          <span className="text-base font-semibold tracking-tight">Best Sub-Zero &amp; Viking Service</span>
          <span className="text-sm text-muted-foreground">Premium appliance repair · NY &amp; NJ</span>
        </div>

        {/* Wrapper takes the remaining row width after the logo (xl:ml-44)
            and centers the nav within that space, rather than the nav
            hugging the logo's edge. */}
        <div className="hidden xl:ml-44 xl:flex xl:flex-1 xl:justify-center">
          <nav aria-label="Primary" className="flex items-center gap-5 text-base font-semibold">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "text-foreground after:scale-x-100" }}
                inactiveProps={{ className: "text-foreground hover:text-accent after:scale-x-0" }}
                className="relative py-1 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:bg-accent after:transition-transform"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <button
          type="button"
          className="xl:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* CTA bar — phone + primary action, full width, high contrast. */}
      <div className="hidden bg-primary text-primary-foreground md:block">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-end gap-6 px-4 md:px-8">
          <a href={telHref} className="inline-flex items-center gap-2 text-lg font-semibold tabular-nums hover:text-accent">
            <Phone className="h-4 w-4" aria-hidden /> {phone}
          </a>
          <Link to="/contact">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Request Service Online
            </Button>
          </Link>
        </div>
      </div>

      {open ? (
        <div className="xl:hidden border-t border-border bg-background">
          <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-sm">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded px-2 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <a href={telHref}>
                <Button variant="outline" className="w-full gap-2">
                  <Phone className="h-4 w-4" /> Call {phone}
                </Button>
              </a>
              <Link to="/contact" onClick={() => setOpen(false)}>
                <Button className="w-full">Request Service</Button>
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
