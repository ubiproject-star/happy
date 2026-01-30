-- update_schema_v4.sql
-- Implements Request from txt1.txt

-- 1. COLUMN CLEANUP
ALTER TABLE public.users DROP COLUMN IF EXISTS bio;
ALTER TABLE public.users DROP COLUMN IF EXISTS last_name;

-- 2. AGE MODIFICATION (birth_year -> age)
-- We will add 'age' column and drop 'birth_year'.
-- Note: Storing Age explicitly means it won't auto-update, but requested by user.
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS age INT;
ALTER TABLE public.users DROP COLUMN IF EXISTS birth_year;

-- 3. COINS RESET (Default 3)
ALTER TABLE public.users ALTER COLUMN coins SET DEFAULT 3;
UPDATE public.users SET coins = 3;

-- 4. RE-VERIFY RPC FUNCTION (Matching Logic)
-- Ensuring it relies on 'gender' and 'interested_in' only.
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
    -- Heterosexual (Man looking for Woman)
    (requesting_user.gender = 'man' AND requesting_user.interested_in = 'female' AND (u.gender = 'woman' OR u.gender = 'trans_woman')) OR
    
    -- Heterosexual (Woman looking for Man)
    (requesting_user.gender = 'woman' AND requesting_user.interested_in = 'male' AND (u.gender = 'man' OR u.gender = 'trans_man')) OR
    
    -- Gay (Man looking for Man)
    (requesting_user.gender = 'man' AND requesting_user.interested_in = 'male' AND (u.gender = 'man' OR u.gender = 'trans_man')) OR
    
    -- Gay (Man looking for Gay) - handling both terms if needed, simplified to Gender matching
    (requesting_user.gender = 'man' AND requesting_user.interested_in = 'gay' AND (u.gender = 'man' OR u.gender = 'trans_man')) OR

    -- Lesbian (Woman looking for Woman/Lesbian)
    (requesting_user.gender = 'woman' AND requesting_user.interested_in = 'female' AND (u.gender = 'woman' OR u.gender = 'trans_woman')) OR
    (requesting_user.gender = 'woman' AND requesting_user.interested_in = 'lesbian' AND (u.gender = 'woman' OR u.gender = 'trans_woman')) OR
    
    -- Bisexual (Looking for Everyone essentially, or specific genders?)
    -- Assuming Bisexual means looking for Both main genders
    (requesting_user.interested_in = 'bisexual') 
  )
  LIMIT 50;
END;
$$;
