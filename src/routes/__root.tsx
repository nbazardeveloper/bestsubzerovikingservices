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
      { name: "msvalidate.01", content: "8603B5AEE860A3E9A624B9A128FDD7C7" },
    ],
    links: [
      // Fonts are self-hosted (see styles.css) and preloaded here so they
      // arrive before first paint — without the preload the late font swap
      // caused layout shift (CLS).
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
      // Third-party tags — Google Tag Manager, Microsoft Advertising UET and
      // the GoHighLevel (LeadConnector) chat widget — are deferred until the
      // visitor first interacts with the page (scroll/tap/key/mouse) or 4s
      // after `load`, whichever comes first. Loading them in <head> made the
      // chat loader render-blocking and put ~500 KB of tag JS on the main
      // thread before the hero could paint (mobile PageSpeed ~57, LCP 10s+).
      // The dataLayer / uetq queues are created immediately, so any events
      // pushed before the tags arrive are still delivered once they load.
      // GTM's <noscript> fallback lives in RootShell. Chat conversations go
      // straight to the CRM through GHL, not Supabase, so they won't show up
      // in /admin/leads (only the /contact form does).
      {
        children: `(function(w,d){
w.dataLayer=w.dataLayer||[];w.uetq=w.uetq||[];
var done=false,evs=["scroll","pointerdown","touchstart","keydown","mousemove"];
function add(src,attrs,onload){var s=d.createElement("script");s.async=true;s.src=src;
if(attrs)for(var k in attrs)s.setAttribute(k,attrs[k]);if(onload)s.onload=onload;d.head.appendChild(s);}
function run(){if(done)return;done=true;
evs.forEach(function(e){w.removeEventListener(e,run,{passive:true});});
w.dataLayer.push({"gtm.start":new Date().getTime(),event:"gtm.js"});
add("https://www.googletagmanager.com/gtm.js?id=GTM-PKFXGLNV");
add("https://bat.bing.com/bat.js",null,function(){
var o={ti:"343195501",enableAutoSpaAdTracking:true};o.q=w.uetq;w.uetq=new UET(o);w.uetq.push("pageLoad");});
add("https://widgets.leadconnectorhq.com/loader.js",{
"data-resources-url":"https://widgets.leadconnectorhq.com/chat-widget/loader.js",
"data-widget-id":"6931f74fe96b4e66a8694988"});}
evs.forEach(function(e){w.addEventListener(e,run,{passive:true});});
if(d.readyState==="complete")setTimeout(run,4000);
else w.addEventListener("load",function(){setTimeout(run,4000);});
})(window,document);`,
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
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PKFXGLNV"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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

  // Auth state only matters on /admin and /auth. The Supabase client (~150 KB
  // of auth/realtime/storage SDK) is imported dynamically there, so public
  // pages never download or execute it.
  useEffect(() => {
    if (!hideChrome) return;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    void import("@/integrations/supabase/client").then(({ supabase }) => {
      if (cancelled) return;
      const { data: sub } = supabase.auth.onAuthStateChange((event) => {
        if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
        router.invalidate();
        if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
      });
      unsubscribe = () => sub.subscription.unsubscribe();
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [hideChrome, router, queryClient]);

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
