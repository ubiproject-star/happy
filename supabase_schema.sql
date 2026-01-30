
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 0. CLEANUP (To prevent "relation already exists" errors)
drop table if exists public.payments cascade;
drop table if exists public.likes cascade;
drop table if exists public.matches cascade;
drop table if exists public.users cascade;
drop function if exists get_compatible_users;

-- 1. USERS Table
create table public.users (
  id bigint primary key, -- Telegram User ID
  username text,
  first_name text,
  last_name text,
  photo_url text,
  language_code text,
  is_premium boolean default false,
  coins int default 0,
  
  -- Matching Profile
  gender text check (gender in ('man', 'woman', 'trans_man', 'trans_woman')),
  interested_in text check (interested_in in ('male', 'female', 'gay', 'bisexual', 'lesbian')),
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Policies (Public read for profile matching, Owner write)
create policy "Public profiles are viewable by everyone" 
  on public.users for select 
  using ( true );

create policy "Users can update own profile" 
  on public.users for update 
  using ( auth.uid()::text = id::text ); -- Casting to text for robustness if auth.uid is string

-- 2. MATCHES Table (Accepted Matches)
create table public.matches (
  id uuid default uuid_generate_v4() primary key,
  user1_id bigint references public.users(id) on delete cascade not null,
  user2_id bigint references public.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user1_id, user2_id)
);

alter table public.matches enable row level security;

create policy "Users can see their own matches" 
  on public.matches for select 
  using ( auth.uid()::text = user1_id::text or auth.uid()::text = user2_id::text );

-- 3. LIKES / SWIPES Table (Storage)
create table public.likes (
  id uuid default uuid_generate_v4() primary key,
  from_user_id bigint references public.users(id) on delete cascade not null,
  to_user_id bigint references public.users(id) on delete cascade not null,
  is_super_like boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(from_user_id, to_user_id)
);

alter table public.likes enable row level security;

create policy "Users can create likes" 
  on public.likes for insert 
  with check ( auth.uid()::text = from_user_id::text );

-- 4. PAYMENTS Table (Ledger)
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id bigint references public.users(id) not null,
  amount int not null,
  currency text default 'XTR',
  status text check (status in ('pending', 'completed', 'failed')),
  telegram_payment_charge_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.payments enable row level security;

create policy "Users can view own payments" 
  on public.payments for select 
  using ( auth.uid()::text = user_id::text );

-- 5. MATCHING LOGIC FUNCTION
-- This function returns users that match the criteria
create or replace function get_compatible_users(requesting_user_id bigint)
returns setof public.users
language plpgsql
as $$
declare
  requesting_user public.users%rowtype;
begin
  -- Get the requesting user's profile
  select * into requesting_user from public.users where id = requesting_user_id;

  if not found then
    return;
  end if;

  return query
  select * from public.users u
  where u.id != requesting_user_id
  and (
    -- GENDER & INTEREST LOGIC
    
    -- Case 1: Hetero Male (Man/TransMan looking for Female)
    (requesting_user.interested_in = 'female' AND 
     (u.gender = 'woman' OR u.gender = 'trans_woman') AND 
     (u.interested_in = 'male' OR u.interested_in = 'bisexual'))
    OR
    -- Case 2: Hetero Female (Woman/TransWoman looking for Male)
    (requesting_user.interested_in = 'male' AND 
     (u.gender = 'man' OR u.gender = 'trans_man') AND 
     (u.interested_in = 'female' OR u.interested_in = 'bisexual'))
    OR
    -- Case 3: Gay (Man/TransMan looking for Gay - Men)
    (requesting_user.interested_in = 'gay' AND 
     (u.gender = 'man' OR u.gender = 'trans_man') AND 
     (u.interested_in = 'gay' OR u.interested_in = 'bisexual'))
    OR
    -- Case 4: Lesbian (Woman/TransWoman looking for Lesbian - Women)
    (requesting_user.interested_in = 'lesbian' AND 
     (u.gender = 'woman' OR u.gender = 'trans_woman') AND 
     (u.interested_in = 'lesbian' OR u.interested_in = 'bisexual'))
    OR
    -- Case 5: Bisexual (Matches anything compatible)
    (requesting_user.interested_in = 'bisexual' AND (
        (requesting_user.gender in ('man', 'trans_man') AND (
            (u.gender in ('woman', 'trans_woman') AND u.interested_in in ('male', 'bisexual')) OR -- Match with women
            (u.gender in ('man', 'trans_man') AND u.interested_in in ('gay', 'bisexual'))        -- Match with men
        ))
        OR
        (requesting_user.gender in ('woman', 'trans_woman') AND (
            (u.gender in ('man', 'trans_man') AND u.interested_in in ('female', 'bisexual')) OR -- Match with men
            (u.gender in ('woman', 'trans_woman') AND u.interested_in in ('lesbian', 'bisexual')) -- Match with women
        ))
    ))
  )
  limit 50;
end;
$$;
