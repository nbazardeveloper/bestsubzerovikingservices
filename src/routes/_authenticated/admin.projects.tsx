import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { adminListProjects, adminSaveProject, adminDeleteProject } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/admin/projects")({
  component: ProjectsAdmin,
});

const EMPTY = {
  id: undefined as string | undefined,
  slug: "",
  title: "",
  description: "",
  brands: "",
  service_area: "",
  image_urls: [] as string[],
  completed_on: "",
  is_published: true,
};

function ProjectsAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => adminListProjects(),
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  function edit(p: Tables<"projects">) {
    setForm({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      brands: (p.brands || []).join(", "),
      service_area: p.service_area || "",
      image_urls: p.image_urls || [],
      completed_on: p.completed_on || "",
      is_published: p.is_published,
    });
    setOpen(true);
  }

  async function upload(files: FileList) {
    for (const file of Array.from(files)) {
      const path = `projects/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error } = await supabase.storage.from("site-media").upload(path, file);
      if (error) {
        toast.error(error.message);
        continue;
      }
      const { data } = supabase.storage.from("site-media").getPublicUrl(path);
      setForm((f) => ({ ...f, image_urls: [...f.image_urls, data.publicUrl] }));
    }
  }

  async function save() {
    setSaving(true);
    try {
      await adminSaveProject({
        data: {
          id: form.id,
          slug: form.slug,
          title: form.title,
          description: form.description,
          brands: form.brands
            .split(",")
            .map((b) => b.trim())
            .filter(Boolean),
          service_area: form.service_area || null,
          image_urls: form.image_urls,
          completed_on: form.completed_on || null,
          is_published: form.is_published,
        },
      });
      toast.success("Saved");
      setOpen(false);
      setForm(EMPTY);
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    try {
      await adminDeleteProject({ data: { id } });
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Portfolio entries shown on the public site.
          </p>
        </div>
        <Button
          onClick={() => {
            setForm(EMPTY);
            setOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> New project
        </Button>
      </header>

      <div className="grid gap-3">
        {data.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{p.title}</span>
                {!p.is_published && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">draft</span>
                )}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                /{p.slug} · {p.service_area ?? "—"} · {p.brands.join(", ")}
              </div>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => edit(p)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => remove(p.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit project" : "New project"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
              <div>
                <Label>Brands (comma-separated)</Label>
                <Input
                  value={form.brands}
                  onChange={(e) => setForm({ ...form, brands: e.target.value })}
                />
              </div>
              <div>
                <Label>Service area</Label>
                <Input
                  value={form.service_area}
                  onChange={(e) => setForm({ ...form, service_area: e.target.value })}
                />
              </div>
              <div>
                <Label>Completed on</Label>
                <Input
                  type="date"
                  value={form.completed_on}
                  onChange={(e) => setForm({ ...form, completed_on: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && upload(e.target.files)}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {form.image_urls.map((u, i) => (
                  <div key={u} className="relative">
                    <img src={u} alt="" className="h-20 w-32 rounded object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, image_urls: form.image_urls.filter((_, j) => j !== i) })
                      }
                      className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-destructive text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={form.is_published}
                onCheckedChange={(v) => setForm({ ...form, is_published: v })}
              />{" "}
              Published
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
