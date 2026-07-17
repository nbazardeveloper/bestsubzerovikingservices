
# Best Sub-Zero & Viking Service — Website + Admin

A premium, minimal marketing site (10 public routes) with a Supabase-backed admin panel. Image placeholders only — no image generation.

## 1. Backend (Lovable Cloud / Supabase)

Enable Lovable Cloud, then create schema in one migration.

Tables (all in `public`, RLS on, with GRANTs):
- `services(id uuid pk, slug text unique, title, brands text[], category, short_description, description, image_url, is_published bool, is_featured bool, sort_order int, created_at)`
- `projects(id uuid pk, slug text unique, title, description, brands text[], service_area, image_urls text[], completed_on date, is_published bool, created_at)`
- `leads(id uuid pk, name, phone, email, service_area, message, source_page, status text default 'new', created_at)`
- `site_settings(id int pk default 1 check(id=1), business_name, phone, email, address, hours, diagnostic_fee, social_links jsonb, review_count int null, review_rating numeric null)` — singleton
- `user_roles(user_id, role app_role)` + `has_role()` security-definer fn (per user-roles guidance)

RLS policies:
- `services`, `projects`: `SELECT` to `anon`/`authenticated` where `is_published = true`; admin full CRUD via `has_role(auth.uid(),'admin')`.
- `leads`: `INSERT` to `anon` (public form); `SELECT/UPDATE/DELETE` admin-only.
- `site_settings`: `SELECT` to `anon`; admin update.
- Grants set per each table for `anon`, `authenticated`, `service_role`.

Storage bucket `site-media` (public) for service/project images, created via storage tool with RLS: public read; admin write.

Seed migration inserts:
- singleton `site_settings` row with all NAP data from the brief.
- ~10 services (fridge/freezer, wine cooler, ice maker, range/stove, oven, cooktop, range hood, outdoor/BBQ, warming drawer, microwave, preventive maintenance) with `is_published=true`, a few `is_featured`.
- 3-4 sample published projects (placeholder image paths).

## 2. Frontend routes (TanStack Start)

Rewrite `src/routes/index.tsx` (replace placeholder). Add routes:

Public (SSR-safe, using publishable-key server fns for reads):
- `/` Home — hero (placeholder image div), phone CTA, brands strip, differentiators, featured services (server fn), featured projects, testimonial teaser, service-area summary, FAQ preview (3), final CTA lead form.
- `/services` — grid + brand/category filter chips (client-side filter over fetched list).
- `/services/$slug` — dynamic detail, related services, service areas, CTA. JSON-LD Service.
- `/projects` — grid, brand filter.
- `/service-area` — 8 area cards + embedded Google Map iframe centered on Staten Island.
- `/about` — verbatim story, process, values.
- `/reviews` — 3-4 clearly-labeled PLACEHOLDER testimonials + Google reviews link button; rating/count fields optional from `site_settings` (hidden if null).
- `/faq` — shadcn Accordion with exact Q&A. JSON-LD FAQPage.
- `/contact` — NAP, hours, lead form (server fn insert), tel: and wa.me: buttons. JSON-LD LocalBusiness.
- `/privacy-policy` — static plain content.

Protected admin (`/_authenticated/admin/*`, integration-managed gate):
- `/auth` — email/password sign-in.
- `/_authenticated/admin` — leads inbox: table, status filter, inline status change.
- `/_authenticated/admin/services` — CRUD, publish/feature toggles, image upload to storage.
- `/_authenticated/admin/projects` — CRUD w/ multi-image upload.
- `/_authenticated/admin/settings` — edit `site_settings` singleton.

Server functions (`src/lib/*.functions.ts`):
- Public: `listPublishedServices`, `getServiceBySlug`, `listFeaturedServices`, `listPublishedProjects`, `getFeaturedProjects`, `getSiteSettings`, `submitLead` (uses publishable client + narrow anon policies).
- Admin (`requireSupabaseAuth` + role check via `has_role`): CRUD for services/projects/leads/settings.

## 3. Design system

Edit `src/styles.css` tokens for premium palette:
- `--background` white, `--foreground` near-black, `--muted` stainless gray, `--primary` deep charcoal, `--accent` subtle blue (`oklch(~0.55 0.14 240)`) used sparingly for links/CTAs.
- Sans-serif via Google Fonts `<link>` in `__root.tsx` head (e.g. Inter or similar clean sans). Generous spacing, large type scale.
- Global `<Header>` (in `__root.tsx`) with logo placeholder, nav, and persistent "Call Now" + "Request Service" CTAs; `<Footer>` with NAP, socials, nav, legal.
- Image placeholders: neutral gray blocks with centered "Image placeholder" label, aspect-ratio wrappers (no real images generated).

## 4. SEO & metadata

- Per-route `head()` with unique 50-60 char title and 150-160 char meta description; single `<h1>` per page; canonical + og:url as relative paths; og:type per page.
- `__root.tsx` sitewide defaults + Organization JSON-LD.
- JSON-LD scripts: LocalBusiness on `/` and `/contact` (from `site_settings`), FAQPage on `/faq`, Service on `/services/$slug`.
- `public/robots.txt` allowing all; `src/routes/sitemap[.]xml.ts` server route generating URLs including dynamic services/projects from DB. `BASE_URL = ""` placeholder.
- Descriptive link text; alt text on every placeholder image (`alt="Placeholder image for {context}"`).

## 5. Technical details

- All server functions read env inside handlers; admin CRUD uses `requireSupabaseAuth` + `has_role(auth.uid(),'admin')` check.
- Client `attachSupabaseAuth` middleware appended in `src/start.ts`.
- Root `onAuthStateChange` subscriber for `SIGNED_IN`/`SIGNED_OUT`/`USER_UPDATED` filter + `router.invalidate()`.
- Lead form validated with Zod client+server.
- Admin sign-in: seed one admin by having user sign up at `/auth`, then run insert into `user_roles` (I'll expose a note/instructions or a one-time server fn gated by a bootstrap secret — likely just tell user to sign up then use SQL tool to grant admin role since only one admin account is expected).
- Google Map: plain iframe embed (no API key) centered on Staten Island.
- WhatsApp button uses `https://wa.me/13476170717`.
- Confirm exact business name spelling with the user before publishing (flagged in brief).

## 6. Out of scope for this build

- No real images generated (placeholders only, per user).
- No `og:image` set anywhere (no image assets exist).
- Review count/rating left null until client provides real numbers.

## 7. Delivery order

1. Enable Lovable Cloud → migration (tables, RLS, grants, roles, seed) + storage bucket.
2. Design tokens + layout chrome (`__root.tsx` header/footer, fonts).
3. Public server fns + public routes (Home first, then rest).
4. Auth route + admin gate + admin CRUD screens.
5. SEO polish: sitemap route, robots.txt, JSON-LD, per-route head.
6. Ask user to confirm name spelling and sign up admin; grant role via SQL.

Confirming one thing before I build: the name — should the site display **"Best Sub-Zero & Viking Service"** (hyphenated) everywhere? I'll use that as the canonical spelling in `site_settings.business_name` and all copy unless you say otherwise.
