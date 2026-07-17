-- Real ratings provided by the client: Google 5.0, Yelp 4.9. Review counts
-- not provided yet, left null until confirmed.
UPDATE public.site_settings
SET
  review_rating = 5.0,
  yelp_review_rating = 4.9,
  updated_at = now()
WHERE id = 1;
