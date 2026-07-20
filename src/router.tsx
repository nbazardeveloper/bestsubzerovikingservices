import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
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
    // Deliberately no defaultPendingComponent/defaultPendingMs here. TanStack
    // Router only swaps the outlet to a pending/loading state if a
    // pendingComponent is actually configured (see load-matches.js: the
    // pendingMs timer that shows it is gated on
    // `route.options.pendingComponent ?? defaultPendingComponent` being
    // truthy). With neither set, a slow transition just keeps the current
    // page fully visible and swaps straight to the new page once its data is
    // ready — no intermediate blank/placeholder state to flash, ever. We'd
    // previously added a pendingComponent (a progress-bar sweep that
    // replaced the outlet with an empty min-h-[70vh] block) specifically to
    // paper over slow Supabase round trips, but that swap-to-blank *was*
    // the "gap" glitch users kept reporting between the header and page
    // content — removing it outright is the actual fix, not a fancier
    // loading indicator. The 5-minute staleTime above plus `intent` preload
    // already keep genuine network round trips rare.
  });

  // The bug behind the "random text/image flashing under the header"
  // report: TanStack Router only resets scroll position once the *new*
  // route's component actually mounts (see react-router's OnRendered ->
  // scroll-restoration.js). Since removing the pendingComponent above means
  // the *old* route stays fully rendered on screen for as long as the new
  // route's loader takes, the old page keeps whatever scroll position it
  // was at that whole time. If you were scrolled halfway down /contact (say,
  // right to the "Trouble loading the scheduler above? Open it in a new
  // tab." line) and clicked "Home", that unrelated line of /contact — not
  // the new page and not a blank box — is what sat under the sticky header
  // until Home's data resolved and the scroll finally jumped to 0. Different
  // scroll depths on different pages is exactly why it looked "random."
  // Fixing this means scrolling to top the instant a navigation to a
  // different path *starts*, instead of waiting for it to finish, so the
  // old page is already showing its own top (not some arbitrary mid-scroll
  // fragment) for the moment it's still visible during the transition.
  if (typeof window !== "undefined") {
    router.subscribe("onBeforeNavigate", (evt) => {
      if (evt.pathChanged) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
  }

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
