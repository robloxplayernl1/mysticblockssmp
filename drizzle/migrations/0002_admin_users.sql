CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  salt text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.admin_users TO service_role;

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public select admin_users" ON public.admin_users AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "No public insert admin_users" ON public.admin_users AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "No public update admin_users" ON public.admin_users AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No public delete admin_users" ON public.admin_users AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);