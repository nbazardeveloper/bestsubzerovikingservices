import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getSiteSettings, type SiteSettings } from "@/lib/site.functions";
import { adminUpdateSettings } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsAdmin,
});

// Same shape as SiteSettings, but the numeric review fields are edited as
// text (so an input can be temporarily empty while typing) instead of number.
type SettingsForm = Omit<
  SiteSettings,
  "review_count" | "review_rating" | "yelp_review_count" | "yelp_review_rating"
> & {
  review_count: number | string | null;
  review_rating: number | string | null;
  yelp_review_count: number | string | null;
  yelp_review_rating: number | string | null;
};

function SettingsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["site-settings"], queryFn: () => getSiteSettings() });
  const [form, setForm] = useState<SettingsForm | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data && !form) setForm({ ...data, social_links: { ...data.social_links } });
  }, [data, form]);
  if (!form) return <p className="text-sm text-muted-foreground">Loading…</p>;

  async function save() {
    if (!form) return;
    setSaving(true);
    try {
      await adminUpdateSettings({
        data: {
          business_name: form.business_name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          hours: form.hours,
          diagnostic_fee: form.diagnostic_fee,
          social_links: form.social_links,
          review_count: form.review_count ? Number(form.review_count) : null,
          review_rating: form.review_rating ? Number(form.review_rating) : null,
          yelp_review_count: form.yelp_review_count ? Number(form.yelp_review_count) : null,
          yelp_review_rating: form.yelp_review_rating ? Number(form.yelp_review_rating) : null,
        },
      });
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["site-settings"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function S<K extends keyof SettingsForm>(k: K, v: SettingsForm[K]) {
    setForm((f) => (f ? { ...f, [k]: v } : f));
  }
  function L(k: string, v: string) {
    setForm((f) => (f ? { ...f, social_links: { ...f.social_links, [k]: v } } : f));
  }

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Site settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          These values appear across the public site.
        </p>
      </header>

      <div className="grid gap-5 rounded-lg border border-border bg-card p-6">
        <div>
          <Label>Business name</Label>
          <Input value={form.business_name} onChange={(e) => S("business_name", e.target.value)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => S("phone", e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={form.email} onChange={(e) => S("email", e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Address / service area label</Label>
          <Textarea
            rows={2}
            value={form.address ?? ""}
            onChange={(e) => S("address", e.target.value)}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Hours</Label>
            <Input value={form.hours ?? ""} onChange={(e) => S("hours", e.target.value)} />
          </div>
          <div>
            <Label>Diagnostic fee</Label>
            <Input
              value={form.diagnostic_fee ?? ""}
              onChange={(e) => S("diagnostic_fee", e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Google review count (optional)</Label>
            <Input
              type="number"
              value={form.review_count ?? ""}
              onChange={(e) => S("review_count", e.target.value)}
            />
          </div>
          <div>
            <Label>Google review rating (optional, 0-5)</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.review_rating ?? ""}
              onChange={(e) => S("review_rating", e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Yelp review count (optional)</Label>
            <Input
              type="number"
              value={form.yelp_review_count ?? ""}
              onChange={(e) => S("yelp_review_count", e.target.value)}
            />
          </div>
          <div>
            <Label>Yelp review rating (optional, 0-5)</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.yelp_review_rating ?? ""}
              onChange={(e) => S("yelp_review_rating", e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label>Social links</Label>
          <div className="mt-2 grid gap-3">
            <Input
              placeholder="Instagram URL"
              value={form.social_links.instagram ?? ""}
              onChange={(e) => L("instagram", e.target.value)}
            />
            <Input
              placeholder="Facebook URL"
              value={form.social_links.facebook ?? ""}
              onChange={(e) => L("facebook", e.target.value)}
            />
            <Input
              placeholder="YouTube URL"
              value={form.social_links.youtube ?? ""}
              onChange={(e) => L("youtube", e.target.value)}
            />
            <Input
              placeholder="Google reviews URL"
              value={form.social_links.google_reviews ?? ""}
              onChange={(e) => L("google_reviews", e.target.value)}
            />
            <Input
              placeholder="Yelp URL"
              value={form.social_links.yelp ?? ""}
              onChange={(e) => L("yelp", e.target.value)}
            />
          </div>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </div>
  );
}
