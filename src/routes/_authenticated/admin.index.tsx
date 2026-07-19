import { createFileRoute, redirect } from "@tanstack/react-router";

// Land admins on the Leads inbox by default — it's the page most likely to
// need daily attention (new submissions from the Contact form and the chat
// widget).
export const Route = createFileRoute("/_authenticated/admin/")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/leads" });
  },
});
