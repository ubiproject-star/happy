
-- NUCLEAR OPTION: Turn off RLS completely to verify App -> DB connection
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Also unblock storage
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- If this works, we know the JWT/Auth is fine, but the Policy Logic was wrong.
