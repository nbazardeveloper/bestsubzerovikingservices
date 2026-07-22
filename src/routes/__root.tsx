import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useMatches,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { CalendarClock } from "lucide-react";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getSiteSettings } from "@/lib/site.functions";
import { cn } from "@/lib/utils";

// Toasts (sonner) are only ever triggered by form submissions (lead form,
// admin, auth) — never needed for the initial render of any page. Loading
// it lazily keeps its code out of the shared vendor chunk that every route
// (including the homepage) would otherwise pay to parse/execute upfront.
const Toaster = lazy(() => import("sonner").then((m) => ({ default: m.Toaster })));

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Best Sub-Zero & Viking Service | NY & NJ Appliance Repair" },
      {
        name: "description",
        content:
          "Premium residential appliance repair in NY & NJ — Sub-Zero, Viking, Wolf, Thermador, Bosch and Dacor. 13 years of honest, transparent, expert service.",
      },
      { name: "author", content: "Best Sub-Zero & Viking Service" },
      { property: "og:site_name", content: "Best Sub-Zero & Viking Service" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0f1115" },
    ],
    links: [
      // Fonts are self-hosted (see styles.css) and preloaded here so they
      // start fetching immediately instead of waiting for the CSS that
      // references them to be discovered.
      {
        rel: "preload",
        href: "/fonts/montserrat-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/opensans-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/favicon-512.png" },
    ],
    scripts: [
      // GoHighLevel (LeadConnector) chat widget — replaces the site's old
      // custom ChatWidget. Chat conversations captured here go straight to
      // the CRM directly through GHL, not through Supabase, so they won't
      // show up in /admin/leads (only the /contact form does).
      {
        src: "https://widgets.leadconnectorhq.com/loader.js",
        "data-resources-url": "https://widgets.leadconnectorhq.com/chat-widget/loader.js",
        "data-widget-id": "6931f74fe96b4e66a8694988",
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Best Sub-Zero & Viking Service",
          telephone: "+1-888-702-8565",
          email: "info@bestsubzerovikingservices.com",
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
          sameAs: [
            "https://instagram.com/best_subzero_viking_service",
            "https://www.facebook.com/BSZVS",
            "https://www.youtube.com/@bestsubzerovikingservice",
          ],
        }),
      },
    ],
  }),
  // SiteHeader and SiteFooter (rendered on every route below) both read the
  // "site-settings" query for phone/social links. Without prefetching it
  // here, pages that don't already load it themselves (only index/contact
  // did) would render header/footer with no data during SSR and then patch
  // in real data on the client — a server/client HTML mismatch that made
  // React discard and re-render the page on hydration (visible as a flash/
  // layout jump right at the top of the page, between header and hero).
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["site-settings"],
      queryFn: () => getSiteSettings(),
    }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const matches = useMatches();
  const hideChrome = matches.some(
    (m) => m.pathname.startsWith("/admin") || m.pathname.startsWith("/auth"),
  );

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={cn("flex min-h-screen flex-col", !hideChrome && "pb-20 md:pb-0")}>
        {!hideChrome && <SiteHeader />}
        <main className="flex-1">
          <Outlet />
        </main>
        {!hideChrome && <SiteFooter />}
      </div>
      {!hideChrome && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] md:hidden">
          <Link to="/contact">
            <Button
              size="lg"
              className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <CalendarClock className="h-4 w-4" /> Request Service
            </Button>
          </Link>
        </div>
      )}
      <Suspense fallback={null}>
        <Toaster position="top-right" richColors closeButton />
      </Suspense>
    </QueryClientProvider>
  );
}
