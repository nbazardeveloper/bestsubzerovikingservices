-- NOTE: this file's timestamp sorts before the migration that creates
-- public.site_settings, so it was intentionally left as a no-op to avoid
-- breaking migration order. The real UPDATE lives in
-- 20260715232100_update_site_settings_nap.sql (correctly ordered after the
-- table-creation migration).
SELECT 1;
