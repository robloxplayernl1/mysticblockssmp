CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'contact',
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  minecraft_name text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  handled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.contact_requests TO service_role;

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public select contact_requests" ON public.contact_requests AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "No public insert contact_requests" ON public.contact_requests AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "No public update contact_requests" ON public.contact_requests AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No public delete contact_requests" ON public.contact_requests AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);