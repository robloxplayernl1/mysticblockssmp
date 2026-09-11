-- Remove public read access to RSVP rows (contains browser_token)
DROP POLICY IF EXISTS "Public read event_rsvps" ON public.event_rsvps;
REVOKE SELECT ON public.event_rsvps FROM anon, authenticated;

-- Remove public read access to individual poll votes (contains browser_token)
DROP POLICY IF EXISTS "Public read poll_votes" ON public.poll_votes;
REVOKE SELECT ON public.poll_votes FROM anon, authenticated;

-- Clarify storage policies: deny all public access to the private staff-avatars bucket
DROP POLICY IF EXISTS "staff-avatars no public read" ON storage.objects;
DROP POLICY IF EXISTS "staff-avatars no public insert" ON storage.objects;
DROP POLICY IF EXISTS "staff-avatars no public update" ON storage.objects;
DROP POLICY IF EXISTS "staff-avatars no public delete" ON storage.objects;

CREATE POLICY "deny public read staff-avatars" ON storage.objects
  AS RESTRICTIVE FOR SELECT TO anon, authenticated
  USING (bucket_id IS DISTINCT FROM 'staff-avatars');

CREATE POLICY "deny public insert staff-avatars" ON storage.objects
  AS RESTRICTIVE FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id IS DISTINCT FROM 'staff-avatars');

CREATE POLICY "deny public update staff-avatars" ON storage.objects
  AS RESTRICTIVE FOR UPDATE TO anon, authenticated
  USING (bucket_id IS DISTINCT FROM 'staff-avatars')
  WITH CHECK (bucket_id IS DISTINCT FROM 'staff-avatars');

CREATE POLICY "deny public delete staff-avatars" ON storage.objects
  AS RESTRICTIVE FOR DELETE TO anon, authenticated
  USING (bucket_id IS DISTINCT FROM 'staff-avatars');