import { redirect } from "@tanstack/react-router";

/**
 * Route options for a legacy Wix URL that no longer has a matching page on
 * the new site. Issues a real HTTP 301 (permanent redirect) so Google
 * transfers the old URL's ranking signals to the new destination instead of
 * indexing a 404 — this is what keeps search rankings from a platform
 * migration when the domain stays the same.
 */
export function legacyRedirect(to: string) {
  return {
    beforeLoad: () => {
      throw redirect({ to, statusCode: 301 });
    },
  } as const;
}
