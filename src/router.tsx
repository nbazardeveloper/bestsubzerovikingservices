import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";
import { RouteProgressBar } from "@/components/site/RouteProgressBar";

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
    // defaultPendingComponent: re-added after confirming (via live testing on
    // prod) what was actually causing the "gap glitch" / stray text under the
    // header that kept getting reported. It's not a CSS/paint issue — it's
    // this: click a nav link -> TanStack Router updates the URL (pushState)
    // and the active nav-link styling immediately, but with no
    // pendingComponent configured, the *previous* route's DOM stays exactly
    // as-is until the new route's loader resolves. That's invisible when the
    // loader resolves in a few ms (cache hit), but once the 5-minute
    // defaultStaleTime above has elapsed since a query was last fetched,
    // ensureQueryData in the loader does a real network round trip before
    // the loader resolves — measured at 10+ seconds against the live prod
    // Supabase-backed server functions in one repro. For that whole window,
    // the address bar/nav says you're on the new page while every pixel on
    // screen is still the old one; whatever finally swaps in (and however
    // scroll position lands at that moment — see the onBeforeNavigate
    // handler below) is what showed up as a stray strip of the old page's
    // text sitting under the header.
    //
    // This was removed once before (see git history) because an
    // *unconditional* pendingComponent was flashing to a blank
    // min-h-[70vh] block on every navigation, back when defaultStaleTime was
    // ~0 and therefore every click triggered a refetch. That's not a risk
    // now: defaultPendingMs (TanStack's default is 1000ms, left as default
    // here) means the progress bar only appears if the loader is still
    // pending after a full second — fast/cached navigations never show it,
    // only the genuinely slow stale-refetch case does, and now that slow
    // case gets an honest loading state instead of silently showing stale
    // content under a URL that's already moved on.
    defaultPendingComponent: RouteProgressBar,
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
