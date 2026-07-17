import { createFileRoute, redirect } from "@tanstack/react-router";

// The site no longer has its own lead-capture form — booking goes through
// the embedded ProsBuddy scheduler on /contact instead, so there's no lead
// inbox to show here anymore. Land admins on Services by default.
export const Route = createFileRoute("/_authenticated/admin/")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/services" });
  },
});
