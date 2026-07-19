import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { RouteProgressBar } from "@/components/site/RouteProgressBar";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  // Default staleTime of 0 means every useQuery/ensureQueryData call is
  // treated as instantly stale, so revisiting a page you were just on (e.g.
  // Home -> Services -> Projects -> Home) re-triggers a real network round
  // trip to Supabase every single time instead of reusing what was just
  // fetched. With no loading skeleton for that window, the page content
  // area would briefly go blank right under the header while it waited —
  // the "gap" glitch (reported as a flash/half-loaded image right between
  // the header and the hero).
  //
  // This was previously set to 60s, which sounds like plenty but isn't in
  // practice: browsing Services or Projects for even a minute before
  // clicking back to Home is completely normal, and that alone was enough
  // to cross the 60s line and re-trigger the glitch. SiteHeader/SiteFooter/
  // ReviewsBar already used a 5-minute staleTime for the exact same
  // site-settings query — this brings the route loaders (index/services/
  // projects/etc, which didn't specify their own staleTime and so fell back
  // to this global default) up to that same 5 minutes, since none of this
  // data changes minute-to-minute anyway.
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 5 * 60 * 1000,
    defaultStaleTime: 5 * 60 * 1000,
    defaultGcTime: 10 * 60 * 1000,
    // Safety net for whenever a transition genuinely does need to hit the
    // network (first visit to a route, cache expired, slow connection): a
    // fixed progress sweep instead of a blank gap under the header. Kept
    // snappy (300ms) so it still shows up for the exact case that prompted
    // this — Supabase round trips that briefly stall a revisit — without
    // flashing on every instant, cached transition.
    defaultPendingComponent: RouteProgressBar,
    defaultPendingMs: 300,
    defaultPendingMinMs: 300,
  });

  // Without this, the client's QueryClient starts with an empty cache on
  // hydration even though SSR already resolved data via `ensureQueryData`
  // in route loaders — every query-driven section on the page (header/
  // footer site settings, featured services, project cards, etc.) would
  // briefly render empty on the client, then pop in once refetched. React
  // treats that as a server/client HTML mismatch and discards + re-renders
  // the whole page, which is what showed up as a visible flash/layout jump
  // right below the header. This dehydrates the server's query cache into
  // the HTML and rehydrates it on the client before first render, so both
  // sides agree from the start.
  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
};
