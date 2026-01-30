-- DISABLE RLS for EVERYTHING (Nuclear Option)
-- Ensuring no table blocks access.

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;

-- Leftover/Unused tables found in screenshot
ALTER TABLE public.swipes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
