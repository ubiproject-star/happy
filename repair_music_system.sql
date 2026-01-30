-- REPAIR SCRIPT: Run this to finish the setup
-- This script handles "already exists" errors and ensures data is inserted.

-- 1. Clear existing data to prevent duplicates (clean slate)
TRUNCATE TABLE app_music;

-- 2. Drop the policy if it exists to avoid the Error 42710
DROP POLICY IF EXISTS "Public music access" ON app_music;

-- 3. Re-create the Policy
ALTER TABLE app_music ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public music access"
ON app_music FOR SELECT
TO PUBLIC
USING ( true );

-- 4. Insert the 25 Tracks
INSERT INTO app_music (title, artist, mood, file_path) VALUES
  ('Midnight Velvet', 'Happi Vibes', 'Erotic', 'track_01.mp3'),
  ('Silk Sheets', 'Happi Vibes', 'Erotic', 'track_02.mp3'),
  ('Deep Dopamine', 'Brainwave', 'Dopamine', 'track_03.mp3'),
  ('Slow Touch', 'Sensual LoFi', 'Erotic', 'track_04.mp3'),
  ('Neon Hearts', 'Synthwave', 'Relaxing', 'track_05.mp3'),
  ('Late Night Text', 'Chillhop', 'Relaxing', 'track_06.mp3'),
  ('Serotonin Rush', 'Brainwave', 'Dopamine', 'track_07.mp3'),
  ('Bedroom Eyes', 'Happi Vibes', 'Erotic', 'track_08.mp3'),
  ('Liquid Dreams', 'Ambient Flow', 'Relaxing', 'track_09.mp3'),
  ('Touch', 'Sensual Beats', 'Erotic', 'track_10.mp3'),
  ('Euphoria Rising', 'Brainwave', 'Dopamine', 'track_11.mp3'),
  ('After Hours', 'Jazz Hop', 'Relaxing', 'track_12.mp3'),
  ('Skin to Skin', 'Happi Vibes', 'Erotic', 'track_13.mp3'),
  ('Pulse', 'Deep House', 'Dopamine', 'track_14.mp3'),
  ('Moonlight Swim', 'Ambient', 'Relaxing', 'track_15.mp3'),
  ('Desire', 'R&B Chill', 'Erotic', 'track_16.mp3'),
  ('Focus Flow', 'LoFi Study', 'Relaxing', 'track_17.mp3'),
  ('Neuro Bliss', 'Binaural', 'Dopamine', 'track_18.mp3'),
  ('Red Light', 'Slow Jam', 'Erotic', 'track_19.mp3'),
  ('Ocean Breath', 'Nature', 'Relaxing', 'track_20.mp3'),
  ('High Frequency', 'Electronic', 'Dopamine', 'track_21.mp3'),
  ('Intimacy', 'Piano Mood', 'Erotic', 'track_22.mp3'),
  ('Velvet Lounge', 'Lounge', 'Relaxing', 'track_23.mp3'),
  ('Endorphin Hit', 'Upbeat', 'Dopamine', 'track_24.mp3'),
  ('The Climax', 'Cinematic', 'Erotic', 'track_25.mp3');

-- 5. Create Storage Bucket (Safe to run even if exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Policy (Drop and Recreate to be safe)
DROP POLICY IF EXISTS "Music is public" ON storage.objects;

CREATE POLICY "Music is public"
ON storage.objects FOR SELECT
TO PUBLIC
USING ( bucket_id = 'music' );
