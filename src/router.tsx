import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { RouteProgressBar } from "@/components/site/RouteProgressBar";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  // Default staleTime of 0 means every useQuery/ensureQueryData call is
  // treated as instantly stale, so revisiting a page you were just on (e.g.
  // Projects -> Services -> Projects -> Services) re-triggers a real network
  // round trip to Supabase every single time instead of reusing what was
  // just fetched. With no loading skeleton for that window, the page content
  // area would briefly go blank right under the header while it waited —
  // the "gap" glitch. A minute of freshness is plenty for mostly-static
  // marketing content and completely removes the redundant refetch.
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 60 * 1000,
    defaultStaleTime: 60 * 1000,
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
