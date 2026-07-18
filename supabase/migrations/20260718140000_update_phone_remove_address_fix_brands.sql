-- Client-requested updates (2026-07-18, revised 2026-07-20):
--   1. The main phone number (calls/SMS) stays the toll-free
--      (888) 702-8565 line — the client clarified that only WhatsApp
--      should use the +1 (347) 617-0717 line (handled entirely in the
--      front end on the contact page; no DB column for it).
--   2. The street address is no longer displayed publicly — cleared here
--      (kept nullable already; hardcoded street-address strings/JSON-LD in
--      the app code were removed separately in this same change).
--   3. Wolf does not manufacture a standalone ice maker product, so "Wolf"
--      is removed from the ice-maker-repair service's brand list.
--   4. Cooking-category services (range/stove, oven, cooktop) are updated
--      to make clear we repair ALL brands for these categories, while
--      specializing in Viking, Wolf and Sub-Zero. Refrigeration brand
--      exclusions (LG, Samsung, Liebherr) are unchanged and remain
--      front-end copy only (services.tsx / faq.tsx).
-- Written as an UPDATE rather than editing the original seed migration,
-- consistent with the project convention (see
-- 20260715232100_update_site_settings_nap.sql), since seed migrations may
-- already have run against the live project.

UPDATE public.site_settings
SET
  address = NULL,
  updated_at = now()
WHERE id = 1;

UPDATE public.services
SET brands = ARRAY['Sub-Zero', 'Viking']
WHERE slug = 'ice-maker-repair';

UPDATE public.services
SET
  short_description = 'Gas and electric range and stove repair — all brands, specializing in Viking, Wolf & Sub-Zero.',
  description = 'We repair gas and dual-fuel ranges and stoves across all brands, with specialized expertise in Viking, Wolf and Sub-Zero. Work includes sealed burners, ignition modules, safety valves, oven igniters, electric elements and control boards.'
WHERE slug = 'range-stove-repair';

UPDATE public.services
SET
  short_description = 'Wall oven and range oven diagnostics and repair — all brands, specializing in Wolf, Viking & Sub-Zero.',
  description = 'Wall ovens, double ovens, convection and steam ovens — we repair all brands, with specialized expertise in Wolf, Viking and Sub-Zero. We address heating faults, thermostat calibration, door hinges, glass replacement, control boards and fan systems.'
WHERE slug = 'oven-repair';

UPDATE public.services
SET
  short_description = 'Gas, induction and electric cooktop repair — all brands, specializing in Wolf, Viking & Sub-Zero.',
  description = 'Cooktop repair for gas, induction and radiant electric surfaces, across all brands, with specialized expertise in Wolf, Viking and Sub-Zero. We handle burner ignition, sealed-burner cleaning and rebuild, induction coil replacement, glass-top replacement and touch controls.'
WHERE slug = 'cooktop-repair';
