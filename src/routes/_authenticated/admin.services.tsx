import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { adminListServices, adminSaveService, adminDeleteService } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: ServicesAdmin,
});

const EMPTY = {
  id: undefined as string | undefined,
  slug: "",
  title: "",
  brands: "" ,
  category: "",
  short_description: "",
  description: "",
  image_url: "",
  is_published: true,
  is_featured: false,
  sort_order: 0,
};

function ServicesAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin-services"], queryFn: () => adminListServices() });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function edit(s: any) {
    setForm({
      id: s.id, slug: s.slug, title: s.title, brands: (s.brands || []).join(", "),
      category: s.category, short_description: s.short_description, description: s.description,
      image_url: s.image_url || "", is_published: s.is_published, is_featured: s.is_featured, sort_order: s.sort_order,
    });
    setOpen(true);
  }

  async function upload(file: File) {
    setUploading(true);
    try {
      const path = `services/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error } = await supabase.storage.from("site-media").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("site-media").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally { setUploading(false); }
  }

  async function save() {
    setSaving(true);
    try {
      await adminSaveService({ data: {
        id: form.id, slug: form.slug, title: form.title,
        brands: form.brands.split(",").map((b) => b.trim()).filter(Boolean),
        category: form.category, short_description: form.short_description, description: form.description,
        image_url: form.image_url || null, is_published: form.is_published, is_featured: form.is_featured,
        sort_order: Number(form.sort_order) || 0,
      } });
      toast.success("Saved");
      setOpen(false); setForm(EMPTY);
      qc.invalidateQueries({ queryKey: ["admin-services"] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this service?")) return;
    try { await adminDeleteService({ data: { id } }); qc.invalidateQueries({ queryKey: ["admin-services"] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); }
  }

  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Services</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage the services shown on the public site.</p>
        </div>
        <Button onClick={() => { setForm(EMPTY); setOpen(true); }}><Plus className="mr-2 h-4 w-4" /> New service</Button>
      </header>

      <div className="grid gap-3">
        {data.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{s.title}</span>
                {!s.is_published && <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">draft</span>}
                {s.is_featured && <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] text-accent-foreground">featured</span>}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">/{s.slug} · {s.category} · order {s.sort_order}</div>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => edit(s)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{form.id ? "Edit service" : "New service"}</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
              <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              <div><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Brands (comma-separated)</Label><Input value={form.brands} onChange={(e) => setForm({ ...form, brands: e.target.value })} /></div>
            <div><Label>Short description</Label><Input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div>
              <Label>Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} disabled={uploading} />
              {form.image_url ? <img src={form.image_url} alt="" className="mt-2 h-24 w-40 rounded object-cover" /> : null}
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} /> Published</label>
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} /> Featured</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
