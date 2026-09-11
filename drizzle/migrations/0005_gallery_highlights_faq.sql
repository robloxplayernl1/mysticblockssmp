CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_items TO anon, authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery_items" ON public.gallery_items FOR SELECT TO public USING (true);
CREATE POLICY "No public insert gallery_items" ON public.gallery_items AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "No public update gallery_items" ON public.gallery_items AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No public delete gallery_items" ON public.gallery_items AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);

CREATE TABLE public.highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  player_name text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  period text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.highlights TO anon, authenticated;
GRANT ALL ON public.highlights TO service_role;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read highlights" ON public.highlights FOR SELECT TO public USING (true);
CREATE POLICY "No public insert highlights" ON public.highlights AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "No public update highlights" ON public.highlights AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No public delete highlights" ON public.highlights AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);

CREATE TABLE public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL DEFAULT '',
  answer text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faq_items TO anon, authenticated;
GRANT ALL ON public.faq_items TO service_role;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read faq_items" ON public.faq_items FOR SELECT TO public USING (true);
CREATE POLICY "No public insert faq_items" ON public.faq_items AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "No public update faq_items" ON public.faq_items AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No public delete faq_items" ON public.faq_items AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);

CREATE POLICY "No public select gallery bucket" ON storage.objects AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (bucket_id <> 'gallery');
CREATE POLICY "No public insert gallery bucket" ON storage.objects AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (bucket_id <> 'gallery');
CREATE POLICY "No public update gallery bucket" ON storage.objects AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (bucket_id <> 'gallery') WITH CHECK (bucket_id <> 'gallery');
CREATE POLICY "No public delete gallery bucket" ON storage.objects AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (bucket_id <> 'gallery');
