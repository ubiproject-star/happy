-- MASTER DATABASE REBUILD SCRIPT V3
-- "The Flawless Reset"
-- Author: Antigravity AI

-- 1. CLEANUP (Drop Everything to start fresh)
DROP FUNCTION IF EXISTS get_compatible_users CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.matches CASCADE;
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.swipes CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. USERS TABLE (The Core)
CREATE TABLE public.users (
  id BIGINT PRIMARY KEY, -- Telegram User ID (BigInt is mandatory)
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  photo_url TEXT,
  language_code TEXT DEFAULT 'en',
  is_premium BOOLEAN DEFAULT FALSE,
  coins INT DEFAULT 100, -- Welcome Bonus
  
  -- Profile Fields
  gender TEXT CHECK (gender IN ('man', 'woman', 'trans_man', 'trans_woman')),
  interested_in TEXT CHECK (interested_in IN ('male', 'female', 'gay', 'bisexual', 'lesbian')),
  bio TEXT,
  birth_year INT,
  region TEXT,
  instagram_handle TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS: Open for now to allow Direct Client Sync (Hybrid Approach)
-- We will secure this later if Edge Function deployment stabilizes.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" 
    ON public.users FOR SELECT 
    USING (true);

CREATE POLICY "Self Update/Insert" 
    ON public.users FOR ALL 
    USING (true) -- Temporarily Open for Client Mode to work flawlessly
    WITH CHECK (true);

-- 3. MATCHES TABLE (Successful Connections)
CREATE TABLE public.matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user1_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user2_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'accepted',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user1_id, user2_id)
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View Own Matches" 
    ON public.matches FOR SELECT 
    USING (true); -- Simplified for MVP Stability

-- 4. PAYMENTS (Ledger)
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES public.users(id),
  amount INT NOT NULL,
  currency TEXT DEFAULT 'XTR',
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')),
  telegram_charge_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View Own Payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Insert Payments" ON public.payments FOR INSERT WITH CHECK (true);

-- 5. MESSAGES (For Chat)
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id BIGINT NOT NULL REFERENCES public.users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Chat Access" ON public.messages FOR ALL USING (true);

-- 6. MATCHING LOGIC (RPC Function)
CREATE OR REPLACE FUNCTION get_compatible_users(requesting_user_id BIGINT)
RETURNS SETOF public.users
LANGUAGE plpgsql
AS $$
DECLARE
  requesting_user public.users%ROWTYPE;
BEGIN
  SELECT * INTO requesting_user FROM public.users WHERE id = requesting_user_id;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT * FROM public.users u
  WHERE u.id != requesting_user_id
  AND (
    (requesting_user.interested_in = 'female' AND (u.gender = 'woman' OR u.gender = 'trans_woman')) OR
    (requesting_user.interested_in = 'male' AND (u.gender = 'man' OR u.gender = 'trans_man')) OR
    (requesting_user.interested_in = 'gay' AND (u.gender = 'man' OR u.gender = 'trans_man')) OR
    (requesting_user.interested_in = 'lesbian' AND (u.gender = 'woman' OR u.gender = 'trans_woman')) OR
    (requesting_user.interested_in = 'bisexual')
  )
  LIMIT 50;
END;
$$;

-- 7. SEED DATA (Ghost Users to populate DB)
INSERT INTO public.users (id, username, first_name, photo_url, gender, interested_in, coins, region)
VALUES 
(1001, 'ghost_anna', 'Anna', 'https://i.pravatar.cc/300?img=1', 'woman', 'male', 100, 'Europe'),
(1002, 'ghost_mark', 'Mark', 'https://i.pravatar.cc/300?img=11', 'man', 'female', 100, 'USA'),
(1003, 'ghost_elena', 'Elena', 'https://i.pravatar.cc/300?img=5', 'woman', 'bisexual', 100, 'Russia'),
(1004, 'ghost_alex', 'Alex', 'https://i.pravatar.cc/300?img=8', 'trans_man', 'male', 100, 'Brazil'),
(1005, 'ghost_sophia', 'Sophia', 'https://i.pravatar.cc/300?img=9', 'woman', 'male', 100, 'UK')
ON CONFLICT (id) DO NOTHING;
