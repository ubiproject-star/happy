-- 1. Create Music Table
create table if not exists app_music (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  artist text default 'Happi Originals',
  file_path text not null, -- e.g., 'track_01.mp3'
  mood text, -- 'Erotic', 'Relaxing', 'Dopamine'
  created_at timestamptz default now()
);

-- 2. Enable RLS (Public Read Only)
alter table app_music enable row level security;

create policy "Public music access"
on app_music for select
to public
using ( true );

-- 3. Seed 25 "Erotic & Dopamine" Tracks (Metadata)
-- NOTE: The user must upload files matching these 'file_path' names to the 'music' storage bucket.

insert into app_music (title, artist, mood, file_path) values
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

-- 4. How to Create the Storage Bucket (Run this in SQL Editor if extensions allow, or do manually)
insert into storage.buckets (id, name, public)
values ('music', 'music', true)
on conflict (id) do nothing;

-- 5. Public Access Policy for Storage
create policy "Music is public"
on storage.objects for select
to public
using ( bucket_id = 'music' );
