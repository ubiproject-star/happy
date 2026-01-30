
-- Insert 15 Ghost Users for Testing

-- 1. Hetero Men (Looking for Women)
INSERT INTO public.users (id, first_name, last_name, username, photo_url, gender, interested_in, coins, is_premium)
VALUES 
(1001, 'Alex', 'M.', 'alex_ghost', 'https://i.pravatar.cc/300?img=11', 'man', 'female', 100, false),
(1002, 'Dmitry', 'Volkov', 'dima_ghost', 'https://i.pravatar.cc/300?img=12', 'man', 'female', 50, false),
(1003, 'John', 'Doe', 'john_ghost', 'https://i.pravatar.cc/300?img=13', 'man', 'female', 200, true);

-- 2. Hetero Women (Looking for Men)
INSERT INTO public.users (id, first_name, last_name, username, photo_url, gender, interested_in, coins, is_premium)
VALUES 
(2001, 'Elena', 'Fox', 'elena_ghost', 'https://i.pravatar.cc/300?img=5', 'woman', 'male', 100, false),
(2002, 'Sarah', 'Connor', 'sarah_ghost', 'https://i.pravatar.cc/300?img=9', 'woman', 'male', 150, true),
(2003, 'Anya', 'Petrova', 'anya_ghost', 'https://i.pravatar.cc/300?img=10', 'woman', 'male', 0, false);

-- 3. Gay Men (Looking for Gay/Men)
INSERT INTO public.users (id, first_name, last_name, username, photo_url, gender, interested_in, coins, is_premium)
VALUES 
(3001, 'Marco', 'Rossi', 'marco_ghost', 'https://i.pravatar.cc/300?img=51', 'man', 'gay', 120, false),
(3002, 'David', 'King', 'david_ghost', 'https://i.pravatar.cc/300?img=53', 'trans_man', 'gay', 300, true),
(3003, 'Sven', 'Larsson', 'sven_ghost', 'https://i.pravatar.cc/300?img=55', 'man', 'gay', 80, false);

-- 4. Lesbians (Looking for Lesbian/Women)
INSERT INTO public.users (id, first_name, last_name, username, photo_url, gender, interested_in, coins, is_premium)
VALUES 
(4001, 'Clara', 'Oswald', 'clara_ghost', 'https://i.pravatar.cc/300?img=20', 'woman', 'lesbian', 90, false),
(4002, 'Maya', 'Angel', 'maya_ghost', 'https://i.pravatar.cc/300?img=22', 'trans_woman', 'lesbian', 250, true),
(4003, 'Lisa', 'Simpson', 'lisa_ghost', 'https://i.pravatar.cc/300?img=24', 'woman', 'lesbian', 10, false);

-- 5. Bisexuals (Mixed, looking for Bisexual/Open)
INSERT INTO public.users (id, first_name, last_name, username, photo_url, gender, interested_in, coins, is_premium)
VALUES 
(5001, 'Jordan', 'Lee', 'jordan_ghost', 'https://i.pravatar.cc/300?img=60', 'man', 'bisexual', 500, false),
(5002, 'Taylor', 'Swift', 'taylor_ghost', 'https://i.pravatar.cc/300?img=44', 'woman', 'bisexual', 1000, true),
(5003, 'Casey', 'Neistat', 'casey_ghost', 'https://i.pravatar.cc/300?img=33', 'man', 'bisexual', 100, false);
