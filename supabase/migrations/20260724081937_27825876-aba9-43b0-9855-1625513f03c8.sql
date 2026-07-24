CREATE TABLE public.ranks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  requirement TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#a78bfa',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ranks TO anon, authenticated;
GRANT ALL ON public.ranks TO service_role;
ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ranks" ON public.ranks FOR SELECT USING (true);

INSERT INTO public.ranks (name, requirement, description, color, sort_order) VALUES
  ('Wanderer', 'Start rank', 'Iedereen begint hier zodra je de wereld betreedt.', '#94a3b8', 1),
  ('Adept', '10 uur speeltijd', 'Je hebt de basis onder de knie en verkent verder.', '#60a5fa', 2),
  ('Mystic', '50 uur speeltijd', 'Een ervaren speler met eigen bouwwerken en vrienden.', '#a78bfa', 3),
  ('Archmage', '150 uur speeltijd', 'Een pilaar van de community met indrukwekkende projecten.', '#f472b6', 4);