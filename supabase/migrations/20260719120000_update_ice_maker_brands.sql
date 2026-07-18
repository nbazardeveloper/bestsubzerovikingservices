-- Client-requested update (2026-07-19): expand the Ice Maker Repair
-- service's brand list to the full set of ice-maker brands serviced.
-- Note: this can also be done by the client directly via /admin/services
-- (edit "Ice Maker Repair" → "Brands (comma-separated)" field) without
-- touching SQL — this migration is provided as an alternative/for
-- consistency with the seed data.

UPDATE public.services
SET
  brands = ARRAY[
    'Sub-Zero',
    'Scotsman',
    'Hoshizaki',
    'U-Line',
    'Marvel',
    'KitchenAid',
    'GE Monogram',
    'Viking',
    'Manitowoc'
  ],
  short_description = 'Repair for built-in and clear-ice ice makers, all major brands.',
  description = 'From dedicated built-in ice makers to in-refrigerator ice systems, we service Sub-Zero, Scotsman, Hoshizaki, U-Line, Marvel, KitchenAid, GE Monogram, Viking, Manitowoc and other major brands — diagnosing water inlet valves, ice mold heaters, augers, control modules and clear-ice production issues.'
WHERE slug = 'ice-maker-repair';
