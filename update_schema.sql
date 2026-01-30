
-- Add missing columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS birth_year int,
ADD COLUMN IF NOT EXISTS region text,
ADD COLUMN IF NOT EXISTS instagram_handle text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone default timezone('utc'::text, now());

-- Create Storage Bucket for Avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Public Read
CREATE POLICY "Avatar Public Read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Storage Policy: Authenticated Upload
CREATE POLICY "Avatar Auth Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Storage Policy: Owner Update/Delete
CREATE POLICY "Avatar Owner Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );
