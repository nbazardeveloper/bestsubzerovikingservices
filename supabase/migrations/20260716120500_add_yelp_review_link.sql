-- Add Yelp review link to social_links (merges with existing keys, doesn't overwrite them).
UPDATE public.site_settings
SET
  social_links = social_links || '{"yelp":"https://www.yelp.com/biz/best-sub-zero-and-viking-service-staten-island-14"}'::jsonb,
  updated_at = now()
WHERE id = 1;
