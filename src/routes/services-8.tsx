import { createFileRoute } from "@tanstack/react-router";
import { legacyRedirect } from "@/lib/legacy-redirect";

// Legacy Wix URL (auto-generated slug for the old services page) —
// permanently redirects to the new services listing.
export const Route = createFileRoute("/services-8")(legacyRedirect("/services"));
