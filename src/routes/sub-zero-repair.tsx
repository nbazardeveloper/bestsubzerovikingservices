import { createFileRoute } from "@tanstack/react-router";
import { legacyRedirect } from "@/lib/legacy-redirect";

// Legacy Wix URL — permanently redirects to the closest matching page.
export const Route = createFileRoute("/sub-zero-repair")(
  legacyRedirect("/services/refrigerator-freezer-repair"),
);
