-- ============================================================
-- BUCKETS
-- ============================================================

-- Sensei and athlete profile photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'senseis',
  'senseis',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Gallery images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  10485760,  -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE POLICIES
-- ============================================================

-- Public read on both buckets (anon can view images)
CREATE POLICY "public_read_senseis"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'senseis');

CREATE POLICY "public_read_gallery"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'gallery');

-- Authenticated write (admin uploads images)
CREATE POLICY "auth_write_senseis"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'senseis');

CREATE POLICY "auth_update_senseis"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'senseis');

CREATE POLICY "auth_delete_senseis"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'senseis');

CREATE POLICY "auth_write_gallery"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "auth_update_gallery"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'gallery');

CREATE POLICY "auth_delete_gallery"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'gallery');
