
-- SEED DATA: 25 Realistic Ghost Users (5 per Category)
-- Tip: Run 'TRUNCATE public.users CASCADE;' before this if you want a clean slate.

INSERT INTO public.users (id, first_name, last_name, username, photo_url, gender, interested_in, coins, is_premium)
VALUES 
-- 1. Hetero Men (Seeking Women)
(1001, 'Liam', 'Henderson', 'liam_h', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', 'man', 'female', 150, false),
(1002, 'Noah', 'Bennett', 'noah_b', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', 'man', 'female', 50, false),
(1003, 'Ethan', 'Sullivan', 'ethan_s', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop', 'man', 'female', 500, true),
(1004, 'Lucas', 'Moretti', 'lucas_m', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop', 'man', 'female', 0, false),
(1005, 'Mason', 'Clark', 'mason_c', 'https://images.unsplash.com/photo-1581382575275-97901c2635b7?w=400&h=400&fit=crop', 'man', 'female', 200, false),

-- 2. Hetero Women (Seeking Men)
(2001, 'Sophia', 'Rodriguez', 'sophia_r', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', 'woman', 'male', 100, false),
(2002, 'Emma', 'Thompson', 'emma_t', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', 'woman', 'male', 1200, true),
(2003, 'Olivia', 'Parker', 'olivia_p', 'https://images.unsplash.com/photo-1554151228-14d9def656ec?w=400&h=400&fit=crop', 'woman', 'male', 50, false),
(2004, 'Ava', 'Kim', 'ava_k', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop', 'woman', 'male', 300, false),
(2005, 'Isabella', 'Martins', 'bella_m', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop', 'woman', 'male', 0, false),

-- 3. Gay Men (Seeking Gay/Men)
(3001, 'Julian', 'Vargas', 'julian_v', 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=400&fit=crop', 'man', 'gay', 250, true),
(3002, 'Oscar', 'Wilde', 'oscar_w', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 'man', 'gay', 100, false),
(3003, 'Leo', 'Anders', 'leo_a', 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=400&h=400&fit=crop', 'trans_man', 'gay', 1500, true),
(3004, 'Finn', 'O''Connor', 'finn_o', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=400&h=400&fit=crop', 'man', 'gay', 80, false),
(3005, 'Elias', 'Cohen', 'elias_c', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop', 'man', 'gay', 40, false),

-- 4. Lesbian Women (Seeking Lesbian/Women)
(4001, 'Zoe', 'Kravitz', 'zoe_k', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', 'woman', 'lesbian', 300, true),
(4002, 'Mia', 'Wong', 'mia_w', 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=400&h=400&fit=crop', 'woman', 'lesbian', 100, false),
(4003, 'Ruby', 'Rose', 'ruby_r', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop', 'trans_woman', 'lesbian', 120, false),
(4004, 'Lily', 'Evans', 'lily_e', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop', 'woman', 'lesbian', 600, true),
(4005, 'Chloe', 'Price', 'chloe_p', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', 'woman', 'lesbian', 20, false),

-- 5. Bisexual (Seeking Bisexual/All)
(5001, 'Jordan', 'Fisher', 'jordan_f', 'https://images.unsplash.com/photo-1605367683935-430c4e72352b?w=400&h=400&fit=crop', 'man', 'bisexual', 750, true),
(5002, 'Alex', 'Morgan', 'alex_m', 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400&h=400&fit=crop', 'woman', 'bisexual', 200, false),
(5003, 'Sam', 'Smith', 'sam_s', 'https://images.unsplash.com/photo-1615109398623-88346a601842?w=400&h=400&fit=crop', 'man', 'bisexual', 150, false),
(5004, 'Riley', 'Reid', 'riley_r', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop', 'woman', 'bisexual', 400, false),
(5005, 'Jamie', 'Oliver', 'jamie_o', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop', 'trans_man', 'bisexual', 90, false)

-- Handle Conflicts
ON CONFLICT (id) DO UPDATE 
SET photo_url = EXCLUDED.photo_url,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    gender = EXCLUDED.gender,
    interested_in = EXCLUDED.interested_in;
