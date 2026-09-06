ALTER TABLE public.events ADD COLUMN IF NOT EXISTS rsvp_enabled boolean NOT NULL DEFAULT true;

CREATE TABLE public.event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  minecraft_name text NOT NULL,
  browser_token text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, minecraft_name)
);
GRANT SELECT ON public.event_rsvps TO anon, authenticated;
GRANT ALL ON public.event_rsvps TO service_role;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read event_rsvps" ON public.event_rsvps FOR SELECT USING (true);
CREATE POLICY "No public insert event_rsvps" ON public.event_rsvps AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "No public update event_rsvps" ON public.event_rsvps AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No public delete event_rsvps" ON public.event_rsvps AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);

CREATE TABLE public.polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  description text NOT NULL DEFAULT '',
  is_open boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.polls TO anon, authenticated;
GRANT ALL ON public.polls TO service_role;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read polls" ON public.polls FOR SELECT USING (true);
CREATE POLICY "No public insert polls" ON public.polls AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "No public update polls" ON public.polls AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No public delete polls" ON public.polls AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);

CREATE TABLE public.poll_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.poll_options TO anon, authenticated;
GRANT ALL ON public.poll_options TO service_role;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read poll_options" ON public.poll_options FOR SELECT USING (true);
CREATE POLICY "No public insert poll_options" ON public.poll_options AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "No public update poll_options" ON public.poll_options AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No public delete poll_options" ON public.poll_options AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);

CREATE TABLE public.poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_id uuid NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
  browser_token text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (poll_id, browser_token)
);
GRANT SELECT ON public.poll_votes TO anon, authenticated;
GRANT ALL ON public.poll_votes TO service_role;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read poll_votes" ON public.poll_votes FOR SELECT USING (true);
CREATE POLICY "No public insert poll_votes" ON public.poll_votes AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "No public update poll_votes" ON public.poll_votes AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No public delete poll_votes" ON public.poll_votes AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);