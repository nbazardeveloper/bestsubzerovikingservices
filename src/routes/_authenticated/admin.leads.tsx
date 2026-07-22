import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminListLeads, adminUpdateLeadStatus, adminDeleteLead } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: LeadsAdmin,
});

const STATUSES = ["new", "contacted", "scheduled", "done"] as const;

const STATUS_STYLES: Record<string, string> = {
  new: "bg-accent/15 text-accent",
  contacted: "bg-muted text-foreground",
  scheduled: "bg-primary/15 text-primary",
  done: "bg-secondary text-secondary-foreground",
};

// The Contact page form writes to the `leads` table via submitLead() — this
// page is where those submissions show up (see the "Source" column, driven
// by source_page). Chat conversations from the GoHighLevel widget go
// straight to the CRM and do NOT appear here.
function LeadsAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => adminListLeads(),
  });

  async function setStatus(id: string, status: string) {
    await adminUpdateLeadStatus({ data: { id, status } });
    qc.invalidateQueries({ queryKey: ["admin-leads"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this lead?")) return;
    await adminDeleteLead({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-leads"] });
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Leads</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Submissions from the Contact page form. Chat widget conversations go straight to the CRM.
        </p>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No leads yet.</p>
      ) : (
        <div className="grid gap-3">
          {data.map((lead) => (
            <div key={lead.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{lead.name}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${STATUS_STYLES[lead.status] ?? "bg-muted text-foreground"}`}
                    >
                      {lead.status}
                    </span>
                    {lead.source_page ? (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {lead.source_page}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <a
                      href={`tel:${lead.phone.replace(/[^+\d]/g, "")}`}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      <Phone className="h-3.5 w-3.5" /> {lead.phone}
                    </a>
                    {lead.email ? (
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center gap-1 hover:text-foreground"
                      >
                        <Mail className="h-3.5 w-3.5" /> {lead.email}
                      </a>
                    ) : null}
                    {lead.service_area ? <span>{lead.service_area}</span> : null}
                    <span>{new Date(lead.created_at).toLocaleString()}</span>
                  </div>
                  {lead.message ? (
                    <p className="mt-2 max-w-2xl text-sm text-foreground">{lead.message}</p>
                  ) : null}
                </div>

                <div className="flex flex-shrink-0 items-center gap-2">
                  <select
                    value={lead.status}
                    onChange={(e) => setStatus(lead.id, e.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <Button size="icon" variant="ghost" onClick={() => remove(lead.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
