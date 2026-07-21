import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/site.functions";
import { cn } from "@/lib/utils";

interface FinalCtaProps {
  heading?: ReactNode;
  subtitle?: string;
  className?: string;
}

// Shared "book now / call us" banner shown near the bottom of every content
// page (site-wide, not just the homepage). The whole section is dark navy
// (bg-primary), full-bleed edge to edge — not just a card floating on the
// page — so it reads as a clear, high-contrast final stop before the footer.
// Self-fetches site settings (cached under the same "site-settings" query
// key that SiteHeader/SiteFooter/__root use) so it can be dropped into any
// route without threading phone/telHref through props.
export function FinalCta({
  heading = (
    <>
      Ready to <span className="text-accent">book</span> a diagnostic?
    </>
  ),
  subtitle = "Book your appointment online, or call us directly for same-day help.",
  className,
}: FinalCtaProps) {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
  });
  const phone = settings?.phone ?? "+1 (888) 702-8565";
  const telHref = `tel:${phone.replace(/[^+\d]/g, "")}`;

  return (
    <section className={cn("bg-primary text-primary-foreground", className)}>
      <div className="mx-auto max-w-4xl px-4 py-24 text-center md:px-8">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{heading}</h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/75">{subtitle}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={telHref}>
            <Button size="lg" className="gap-2 bg-white text-primary hover:bg-white/90">
              <Phone className="h-4 w-4" /> Call {phone}
            </Button>
          </a>
          <Link to="/contact">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Book online
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
