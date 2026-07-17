-- Update site_settings with the client-provided NAP address, phone, email
-- (matched to the existing bestsubzerovikingservices.com site to keep NAP
-- consistent with Google Business Profile) and the Manhattan diagnostic-fee
-- tier. Written as an UPDATE rather than editing the original seed
-- migration, since that migration may already have run against the live
-- project.
UPDATE public.site_settings
SET
  address = '23 Joel Pl, Staten Island, NY 10306',
  phone = '+1 (888) 702-8565',
  email = 'info@bestsubzerovikingservices.com',
  diagnostic_fee = '$95, waived when the repair is completed ($125 in Manhattan, also waived)',
  updated_at = now()
WHERE id = 1;
