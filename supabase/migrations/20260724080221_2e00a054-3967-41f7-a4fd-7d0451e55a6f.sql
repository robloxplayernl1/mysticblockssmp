
-- site_settings: single row keyed by id='main'
CREATE TABLE public.site_settings (
  id text PRIMARY KEY DEFAULT 'main',
  hero_title text NOT NULL DEFAULT 'MysticBlocksSMP',
  hero_subtitle text NOT NULL DEFAULT 'Een magische Minecraft SMP wereld vol avontuur',
  server_ip text NOT NULL DEFAULT 'mysticblockssmp.mcsh.io',
  discord_link text NOT NULL DEFAULT 'https://discord.gg/Y4BchzeFJH',
  announcement text NOT NULL DEFAULT '',
  rules_text text NOT NULL DEFAULT '1. Wees respectvol tegen andere spelers.
2. Geen griefing of stelen.
3. Geen hacks of cheats.
4. Geen spam in de chat.
5. Volg altijd de instructies van de staff.',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
INSERT INTO public.site_settings (id) VALUES ('main') ON CONFLICT DO NOTHING;

-- events
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  event_date timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon, authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);

-- staff
CREATE TABLE public.staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT 'Staff',
  description text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.staff TO anon, authenticated;
GRANT ALL ON public.staff TO service_role;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read staff" ON public.staff FOR SELECT USING (true);

-- ranks
CREATE TABLE public.ranks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  perks text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ranks TO anon, authenticated;
GRANT ALL ON public.ranks TO service_role;
ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ranks" ON public.ranks FOR SELECT USING (true);

-- Seed a couple of demo entries
INSERT INTO public.staff (name, role, description, sort_order) VALUES
  ('ytkgh1', 'Owner', 'Oprichter van MysticBlocksSMP', 1);

INSERT INTO public.ranks (name, description, perks, price, sort_order) VALUES
  ('Member', 'Standaard rank voor iedereen', '/spawn, /home, /tpa', 'Gratis', 1),
  ('VIP', 'Ondersteun de server en krijg extra perks', '3 sethomes, /nick, gekleurde chat', '€4,99', 2),
  ('MVP', 'De ultieme rank', '10 sethomes, /fly in survival, custom prefix', '€9,99', 3);
