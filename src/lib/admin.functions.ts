import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { DB_STUBBED, mockServices, mockProjects } from "./db-stub";

// While DB_STUBBED is true, mock lists/writes below are mutated in-memory
// per server process (resets on restart). Fine for local UI testing only.
const stubLeads: Array<{
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service_area: string | null;
  message: string | null;
  source_page: string | null;
  status: string;
  created_at: string;
}> = [];
let stubServices = [...mockServices];
let stubProjects = [...mockProjects];

async function assertAdmin(ctx: { supabase: SupabaseClient<Database>; userId: string }) {
  if (DB_STUBBED) return; // DB disconnected — skip the role lookup
  const { data, error } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

// ---------- Leads ----------
export const adminListLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    if (DB_STUBBED) return [...stubLeads].reverse();
    const { data, error } = await context.supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpdateLeadStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status: string }) => {
    if (!["new", "contacted", "scheduled", "done"].includes(d.status))
      throw new Error("Bad status");
    return d;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (DB_STUBBED) {
      const lead = stubLeads.find((l) => l.id === data.id);
      if (lead) lead.status = data.status;
      return { ok: true };
    }
    const { error } = await context.supabase
      .from("leads")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (DB_STUBBED) {
      const idx = stubLeads.findIndex((l) => l.id === data.id);
      if (idx !== -1) stubLeads.splice(idx, 1);
      return { ok: true };
    }
    const { error } = await context.supabase.from("leads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Services ----------
type ServiceInput = {
  id?: string;
  slug: string;
  title: string;
  brands: string[];
  category: string;
  short_description: string;
  description: string;
  image_url?: string | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
};

export const adminListServices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    if (DB_STUBBED) return [...stubServices].sort((a, b) => a.sort_order - b.sort_order);
    const { data, error } = await context.supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminSaveService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: ServiceInput) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload = {
      slug: data.slug.trim(),
      title: data.title.trim(),
      brands: data.brands,
      category: data.category.trim(),
      short_description: data.short_description,
      description: data.description,
      image_url: data.image_url || null,
      is_published: data.is_published,
      is_featured: data.is_featured,
      sort_order: data.sort_order,
    };
    if (DB_STUBBED) {
      if (data.id) {
        const idx = stubServices.findIndex((s) => s.id === data.id);
        if (idx !== -1) stubServices[idx] = { ...stubServices[idx], ...payload };
      } else {
        stubServices.push({
          ...payload,
          id: `svc-${Date.now()}`,
          created_at: new Date().toISOString(),
        });
      }
      return { ok: true };
    }
    if (data.id) {
      const { error } = await context.supabase.from("services").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase.from("services").insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (DB_STUBBED) {
      stubServices = stubServices.filter((s) => s.id !== data.id);
      return { ok: true };
    }
    const { error } = await context.supabase.from("services").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Projects ----------
type ProjectInput = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  brands: string[];
  service_area?: string | null;
  image_urls: string[];
  completed_on?: string | null;
  is_published: boolean;
};

export const adminListProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    if (DB_STUBBED) return [...stubProjects].reverse();
    const { data, error } = await context.supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminSaveProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: ProjectInput) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload = {
      slug: data.slug.trim(),
      title: data.title.trim(),
      description: data.description,
      brands: data.brands,
      service_area: data.service_area || null,
      image_urls: data.image_urls,
      completed_on: data.completed_on || null,
      is_published: data.is_published,
    };
    if (DB_STUBBED) {
      if (data.id) {
        const idx = stubProjects.findIndex((p) => p.id === data.id);
        if (idx !== -1) stubProjects[idx] = { ...stubProjects[idx], ...payload };
      } else {
        stubProjects.push({
          ...payload,
          id: `prj-${Date.now()}`,
          created_at: new Date().toISOString(),
        });
      }
      return { ok: true };
    }
    if (data.id) {
      const { error } = await context.supabase.from("projects").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase.from("projects").insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (DB_STUBBED) {
      stubProjects = stubProjects.filter((p) => p.id !== data.id);
      return { ok: true };
    }
    const { error } = await context.supabase.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Settings ----------
type SettingsInput = {
  business_name: string;
  phone: string;
  email: string;
  address?: string | null;
  hours?: string | null;
  diagnostic_fee?: string | null;
  social_links: Record<string, string>;
  review_count?: number | null;
  review_rating?: number | null;
  yelp_review_count?: number | null;
  yelp_review_rating?: number | null;
};

export const adminUpdateSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: SettingsInput) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (DB_STUBBED) {
      console.warn("[db-stub] adminUpdateSettings called while DB is stubbed — not saved:", data);
      return { ok: true };
    }
    const { error } = await context.supabase
      .from("site_settings")
      .update({
        business_name: data.business_name,
        phone: data.phone,
        email: data.email,
        address: data.address ?? null,
        hours: data.hours ?? null,
        diagnostic_fee: data.diagnostic_fee ?? null,
        social_links: data.social_links,
        review_count: data.review_count ?? null,
        review_rating: data.review_rating ?? null,
        yelp_review_count: data.yelp_review_count ?? null,
        yelp_review_rating: data.yelp_review_rating ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (DB_STUBBED) return { isAdmin: true, userId: context.userId };
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data, userId: context.userId };
  });
