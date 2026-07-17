import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin.functions";
import { toast } from "sonner";

const NAV: Array<{ to: "/admin/services" | "/admin/projects" | "/admin/settings"; label: string; exact?: boolean }> = [
  { to: "/admin/services", label: "Services" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/settings", label: "Settings" },
];

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: admin, isLoading } = useQuery({
    queryKey: ["is-admin"],
    queryFn: () => checkIsAdmin(),
    retry: false,
  });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!admin?.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
        <div className="max-w-md rounded-lg border border-border bg-card p-8 text-center">
          <h1 className="text-xl font-semibold">Not an admin</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            You're signed in but this account has no admin role assigned. Ask the site owner to grant admin access.
          </p>
          {admin?.userId ? (
            <p className="mt-3 rounded bg-muted p-2 font-mono text-[10px] break-all">Your user ID: {admin.userId}</p>
          ) : null}
          <div className="mt-6 flex justify-center gap-2">
            <Button variant="outline" onClick={signOut}>Sign out</Button>
            <Link to="/"><Button variant="ghost">Home</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-60 flex-shrink-0 border-r border-border bg-background p-6 md:block">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
          <div className="grid h-8 w-8 place-items-center rounded-sm bg-primary text-primary-foreground text-xs">BSV</div>
          Admin
        </Link>
        <nav className="mt-8 grid gap-1 text-sm">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded px-3 py-2 transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 grid gap-2">
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2"><Home className="h-4 w-4" /> View site</Button>
          </Link>
          <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={signOut}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      <div className="flex-1 md:hidden">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-3">
          <span className="text-sm font-semibold">BSV Admin</span>
          <div className="flex gap-2">
            <Link to="/"><Button size="sm" variant="ghost">Site</Button></Link>
            <Button size="sm" variant="outline" onClick={signOut}>Sign out</Button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-background px-4 py-2 text-xs">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={`whitespace-nowrap rounded px-3 py-1.5 ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
