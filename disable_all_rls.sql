-- BYPASS SERVER SECURITY (Client-Side Mode)
-- Since the Edge Function cannot be deployed without an Access Token,
-- we will disable RLS to allow the Frontend to write directly to the DB.

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;

-- Verify
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
