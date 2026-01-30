
-- 1. ADD MISSING COLUMNS
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS birth_year int,
ADD COLUMN IF NOT EXISTS region text,
ADD COLUMN IF NOT EXISTS instagram_handle text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone default timezone('utc'::text, now());

-- 2. CREATE AVATAR BUCKET
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. STORAGE POLICIES (Drop first to ensure clean state)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Avatar Public Read" ON storage.objects;
    DROP POLICY IF EXISTS "Avatar Auth Upload" ON storage.objects;
    DROP POLICY IF EXISTS "Avatar Owner Update" ON storage.objects;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

CREATE POLICY "Avatar Public Read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

CREATE POLICY "Avatar Auth Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

CREATE POLICY "Avatar Owner Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );
