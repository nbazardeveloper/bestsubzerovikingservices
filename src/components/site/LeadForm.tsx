import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitLead } from "@/lib/site.functions";

const AREAS = [
  "Staten Island",
  "Brooklyn",
  "Queens",
  "Long Island",
  "Great Neck",
  "Jersey City",
  "Elizabeth, NJ",
  "North & Central NJ",
  "Other",
];

const schema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(200),
  phone: z.string().trim().min(5, "Please add a phone number").max(40),
  email: z.string().trim().email("Please enter a valid email").max(320).or(z.literal("")).optional(),
  service_area: z.string().max(80).optional(),
  message: z.string().trim().max(5000).optional(),
});

export function LeadForm({ sourcePage, compact = false }: { sourcePage: string; compact?: boolean }) {
  const submit = useServerFn(submitLead);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd) as Record<string, string>;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      await submit({
        data: {
          name: parsed.data.name,
          phone: parsed.data.phone,
          email: parsed.data.email || undefined,
          service_area: parsed.data.service_area || undefined,
          message: parsed.data.message || undefined,
          source_page: sourcePage,
        },
      });
      setDone(true);
      toast.success("Thanks — we'll get back to you shortly.");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please call us instead.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm">
        <p className="font-medium">Request received.</p>
        <p className="mt-2 text-muted-foreground">A technician will contact you shortly. For same-day help, please call us directly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        <div className="grid gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" required autoComplete="tel" />
        </div>
      </div>
      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email <span className="text-muted-foreground">(optional)</span></Label>
          <Input id="email" name="email" type="email" autoComplete="email" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="service_area">Service area</Label>
          <select
            id="service_area"
            name="service_area"
            defaultValue=""
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="" disabled>Select an area…</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="message">Appliance &amp; problem</Label>
        <Textarea id="message" name="message" rows={4} placeholder="Brand, model number, and a short description of the issue." />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Sending…" : "Request service"}
        </Button>
        <p className="text-xs text-muted-foreground">By submitting, you agree to be contacted about your request.</p>
      </div>
    </form>
  );
}
