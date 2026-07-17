import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { DB_STUBBED, mockSiteSettings, mockServices, mockProjects } from "./db-stub";

function serverPublicClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type SiteSettings = {
  business_name: string;
  phone: string;
  email: string;
  address: string | null;
  hours: string | null;
  diagnostic_fee: string | null;
  social_links: Record<string, string>;
  review_count: number | null;
  review_rating: number | null;
  yelp_review_count: number | null;
  yelp_review_rating: number | null;
};

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async (): Promise<SiteSettings> => {
  if (DB_STUBBED) return mockSiteSettings;
  const s = serverPublicClient();
  const { data, error } = await s.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Site settings missing");
  return {
    business_name: data.business_name,
    phone: data.phone,
    email: data.email,
    address: data.address,
    hours: data.hours,
    diagnostic_fee: data.diagnostic_fee,
    social_links: (data.social_links as Record<string, string>) ?? {},
    review_count: data.review_count,
    review_rating: data.review_rating,
    yelp_review_count: data.yelp_review_count,
    yelp_review_rating: data.yelp_review_rating,
  };
});

export const listServices = createServerFn({ method: "GET" }).handler(async () => {
  if (DB_STUBBED) return mockServices;
  const s = serverPublicClient();
  const { data, error } = await s
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const listFeaturedServices = createServerFn({ method: "GET" }).handler(async () => {
  if (DB_STUBBED) return mockServices.filter((s) => s.is_featured);
  const s = serverPublicClient();
  const { data, error } = await s
    .from("services")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getServiceBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    if (DB_STUBBED) return mockServices.find((s) => s.slug === data.slug) ?? null;
    const s = serverPublicClient();
    const { data: row, error } = await s
      .from("services")
      .select("*")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const listProjects = createServerFn({ method: "GET" }).handler(async () => {
  if (DB_STUBBED) return mockProjects;
  const s = serverPublicClient();
  const { data, error } = await s
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const listFeaturedProjects = createServerFn({ method: "GET" }).handler(async () => {
  if (DB_STUBBED) return mockProjects.slice(0, 3);
  const s = serverPublicClient();
  const { data, error } = await s
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((d: {
    name: string;
    phone: string;
    email?: string;
    service_area?: string;
    message?: string;
    source_page?: string;
  }) => {
    if (!d.name || d.name.length < 1 || d.name.length > 200) throw new Error("Invalid name");
    if (!d.phone || d.phone.length < 5 || d.phone.length > 40) throw new Error("Invalid phone");
    if (d.email && d.email.length > 320) throw new Error("Invalid email");
    if (d.message && d.message.length > 5000) throw new Error("Message too long");
    return d;
  })
  .handler(async ({ data }) => {
    if (DB_STUBBED) {
      console.warn("[db-stub] submitLead called while DB is stubbed — lead was NOT saved:", data);
      return { ok: true };
    }
    const s = serverPublicClient();
    const { error } = await s.from("leads").insert({
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      service_area: data.service_area?.trim() || null,
      message: data.message?.trim() || null,
      source_page: data.source_page?.trim() || null,
      status: "new",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
