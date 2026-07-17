
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  brands TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads published services" ON public.services FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  brands TEXT[] NOT NULL DEFAULT '{}',
  service_area TEXT,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  completed_on DATE,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads published projects" ON public.projects FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Leads
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service_area TEXT,
  message TEXT,
  source_page TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit lead" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read leads" ON public.leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update leads" ON public.leads FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete leads" ON public.leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Site settings (singleton)
CREATE TABLE public.site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  business_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT,
  hours TEXT,
  diagnostic_fee TEXT,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  review_count INT,
  review_rating NUMERIC(2,1),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed site settings
INSERT INTO public.site_settings (id, business_name, phone, email, address, hours, diagnostic_fee, social_links)
VALUES (
  1,
  'Best Sub-Zero & Viking Service',
  '+1 (347) 617-0717',
  'bestsubzerovikingservices@gmail.com',
  'Serving Staten Island, Brooklyn, Queens, Long Island, Great Neck, Jersey City, Elizabeth NJ, North & Central NJ',
  'Mon–Sat: 8:00 AM – 7:00 PM',
  '$95 (waived when repair is completed)',
  '{"instagram":"https://instagram.com/best_subzero_viking_service","facebook":"https://www.facebook.com/BSZVS","youtube":"https://www.youtube.com/@bestsubzerovikingservice","google_reviews":"https://share.google/JpOFNRbqklRGN26Ui"}'::jsonb
);

-- Seed services
INSERT INTO public.services (slug, title, brands, category, short_description, description, is_featured, sort_order) VALUES
('refrigerator-freezer-repair', 'Refrigerator & Freezer Repair', ARRAY['Sub-Zero','Viking','Thermador','GE Monogram'], 'Refrigeration', 'Expert repair for built-in and freestanding refrigerators and freezers.', 'We service Sub-Zero, Viking, Thermador and other premium built-in and freestanding refrigerators and freezers. Common issues we resolve include temperature problems, compressor failures, evaporator icing, condenser cleaning, control board faults, door seal replacement and drainage issues.', true, 1),
('wine-cooler-repair', 'Wine Cooler Repair', ARRAY['Sub-Zero','Viking','Thermador'], 'Refrigeration', 'Precision service for wine preservation units and dual-zone wine coolers.', 'Wine coolers require careful diagnostics to protect your collection. We repair cooling systems, thermostats, dual-zone controls, humidity issues, door seals and lighting on Sub-Zero, Viking and other premium wine preservation units.', true, 2),
('ice-maker-repair', 'Ice Maker Repair', ARRAY['Sub-Zero','Viking','Wolf'], 'Refrigeration', 'Repair for built-in and clear-ice ice makers.', 'From dedicated built-in ice makers to in-refrigerator ice systems, we diagnose water inlet valves, ice mold heaters, augers, control modules and clear-ice production issues.', false, 3),
('range-stove-repair', 'Range & Stove Repair', ARRAY['Viking','Wolf','Thermador','Bertazzoni','Dacor'], 'Cooking', 'Gas and electric range and stove repair for premium brands.', 'We repair gas and dual-fuel ranges, sealed burners, ignition modules, safety valves, oven igniters, electric elements and control boards on Viking, Wolf, Thermador, Bertazzoni and Dacor equipment.', true, 4),
('oven-repair', 'Oven Repair', ARRAY['Wolf','Viking','Thermador','Bosch'], 'Cooking', 'Wall oven and range oven diagnostics and repair.', 'Wall ovens, double ovens, convection and steam ovens — we address heating faults, thermostat calibration, door hinges, glass replacement, control boards and fan systems.', false, 5),
('cooktop-repair', 'Cooktop Repair', ARRAY['Wolf','Viking','Thermador','Bosch'], 'Cooking', 'Gas, induction and electric cooktop repair.', 'Cooktop repair for gas, induction and radiant electric surfaces. We handle burner ignition, sealed-burner cleaning and rebuild, induction coil replacement, glass-top replacement and touch controls.', false, 6),
('range-hood-repair', 'Range Hood & Ventilation Repair', ARRAY['Wolf','Viking','Thermador'], 'Ventilation', 'Repair for professional range hoods, blowers and downdraft ventilation.', 'We service internal and external blowers, downdraft systems, lighting, dampers and controls on professional-grade range hoods.', false, 7),
('outdoor-kitchen-bbq-repair', 'Outdoor Kitchen & BBQ Repair', ARRAY['Wolf','Viking','Sub-Zero'], 'Outdoor', 'Repair for outdoor grills, outdoor refrigeration and BBQ islands.', 'We repair outdoor grills, outdoor refrigeration, warming drawers and outdoor kitchen components — burners, ignition, gas systems and weather-related failures.', false, 8),
('warming-drawer-repair', 'Warming Drawer & Food Warmer Repair', ARRAY['Wolf','Viking','Thermador'], 'Cooking', 'Precise repair for built-in warming drawers.', 'Warming drawer heating elements, controls, thermostats and drawer mechanisms serviced on Wolf, Viking and Thermador units.', false, 9),
('microwave-repair', 'Microwave Repair', ARRAY['Wolf','Viking','Thermador','GE Monogram'], 'Cooking', 'Built-in and speed-oven microwave repair.', 'We repair built-in microwaves, drawer microwaves, speed ovens and convection microwaves, including magnetrons, high-voltage components, door interlocks and control boards.', false, 10),
('preventive-maintenance', 'Preventive Maintenance & Diagnostics', ARRAY['Sub-Zero','Viking','Wolf','Thermador','Bosch','Dacor','GE Monogram','Bertazzoni'], 'Maintenance', 'Scheduled maintenance to extend the life of premium appliances.', 'Preventive maintenance for refrigeration and cooking appliances: condenser cleaning, seal inspection, calibration, safety checks and full diagnostics to prevent costly failures.', true, 11);

-- Seed projects
INSERT INTO public.projects (slug, title, description, brands, service_area, is_published) VALUES
('subzero-648pro-restoration-si', 'Sub-Zero 648PRO Full Restoration', 'Complete diagnostics and compressor replacement on a Sub-Zero 648PRO built-in refrigerator/freezer. Restored proper cooling on both sides and re-sealed all gaskets.', ARRAY['Sub-Zero'], 'Staten Island', true),
('viking-vgic-range-rebuild-bk', 'Viking VGIC Range Ignition Rebuild', 'Rebuilt spark ignition system and replaced safety valves on a Viking Professional gas range. Verified flame stability across all burners.', ARRAY['Viking'], 'Brooklyn', true),
('wolf-doubleoven-control-li', 'Wolf Double Oven Control Board Replacement', 'Diagnosed erratic temperature behavior on a Wolf built-in double oven, replaced control board and recalibrated both cavities.', ARRAY['Wolf'], 'Long Island', true),
('thermador-cooktop-induction-nj', 'Thermador Induction Cooktop Repair', 'Replaced two failed induction coils and control interface on a Thermador Freedom induction cooktop. Full function restored.', ARRAY['Thermador'], 'Jersey City', true);
