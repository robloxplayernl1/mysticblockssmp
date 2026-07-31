CREATE TABLE public.changelog (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  body text NOT NULL DEFAULT ''::text,
  entry_date timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.changelog TO anon;
GRANT SELECT ON public.changelog TO authenticated;
GRANT ALL ON public.changelog TO service_role;

ALTER TABLE public.changelog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read changelog" ON public.changelog FOR SELECT USING (true);

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS maintenance_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS maintenance_text text NOT NULL DEFAULT 'We zijn even bezig met onderhoud. Kom later terug!'::text;

INSERT INTO public.changelog (title, body, entry_date) VALUES
  ('Website live!', 'De MysticBlocksSMP website is online met live serverstatus, events, ranks en regels.', now());