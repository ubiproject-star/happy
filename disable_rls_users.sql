-- DANGER: This disables security for the users table
-- Use this ONLY for debugging why the Edge Function cannot write to it.

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Verify it's disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';
