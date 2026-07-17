-- Separate rating/count columns for Yelp (existing review_count/review_rating are Google's).
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS yelp_review_count INT,
  ADD COLUMN IF NOT EXISTS yelp_review_rating NUMERIC(2,1);
