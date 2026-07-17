import { createFileRoute } from "@tanstack/react-router";
import { legacyRedirect } from "@/lib/legacy-redirect";

// Legacy Wix URL (former main "Landing Page" nav link) — permanently
// redirects to the new services listing.
export const Route = createFileRoute("/sub-zero-viking-wolf-repair")(legacyRedirect("/services"));
