ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS maintenance_pages text[] NOT NULL DEFAULT '{}',
ADD COLUMN IF NOT EXISTS opening_hours_enabled boolean NOT NULL DEFAULT true;