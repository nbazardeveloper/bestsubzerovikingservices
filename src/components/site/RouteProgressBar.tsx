// Shown by the router in place of the outlet's content once a route
// transition's loader has been pending for a little while (see
// `defaultPendingComponent`/`defaultPendingMs` in router.tsx). TanStack
// Router swaps this in for the *previous* page's content once the pending
// threshold passes, so a bare 2px bar alone would make the page visually
// collapse to almost nothing — worse than the gap it's meant to fix. The
// fixed bar gives an immediate "something is happening" signal (it never
// shifts layout, it just sweeps above the header), and the min-height block
// keeps the outlet area roughly page-sized so the footer doesn't jump up
// and back down once real content swaps in a moment later.
export function RouteProgressBar() {
  return (
    <>
      <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-transparent">
        <div className="animate-route-progress h-full w-1/3 bg-accent" />
      </div>
      <div aria-hidden className="min-h-[70vh]" />
    </>
  );
}
