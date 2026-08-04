-- Explicit deny of all write operations for anon/authenticated on public content tables.
-- service_role bypasses RLS, so the admin panel (server-side) keeps working.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['changelog','events','ranks','site_settings','staff'] LOOP
    EXECUTE format('REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.%I FROM anon, authenticated', t);
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('DROP POLICY IF EXISTS "No public insert %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "No public update %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "No public delete %1$s" ON public.%1$I', t);
    EXECUTE format('CREATE POLICY "No public insert %1$s" ON public.%1$I AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false)', t);
    EXECUTE format('CREATE POLICY "No public update %1$s" ON public.%1$I AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false)', t);
    EXECUTE format('CREATE POLICY "No public delete %1$s" ON public.%1$I AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false)', t);
  END LOOP;
END $$;

-- Explicit storage.objects policies for the private staff-avatars bucket.
DROP POLICY IF EXISTS "staff-avatars no public read" ON storage.objects;
DROP POLICY IF EXISTS "staff-avatars no public insert" ON storage.objects;
DROP POLICY IF EXISTS "staff-avatars no public update" ON storage.objects;
DROP POLICY IF EXISTS "staff-avatars no public delete" ON storage.objects;

CREATE POLICY "staff-avatars no public read" ON storage.objects
  AS RESTRICTIVE FOR SELECT TO anon, authenticated
  USING (bucket_id <> 'staff-avatars');
CREATE POLICY "staff-avatars no public insert" ON storage.objects
  AS RESTRICTIVE FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id <> 'staff-avatars');
CREATE POLICY "staff-avatars no public update" ON storage.objects
  AS RESTRICTIVE FOR UPDATE TO anon, authenticated
  USING (bucket_id <> 'staff-avatars') WITH CHECK (bucket_id <> 'staff-avatars');
CREATE POLICY "staff-avatars no public delete" ON storage.objects
  AS RESTRICTIVE FOR DELETE TO anon, authenticated
  USING (bucket_id <> 'staff-avatars');