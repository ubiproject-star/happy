-- Try to manually insert a fake Telegram User to see if the table accepts it
-- This helps us verify if the 'id' column type (BigInt) is correct.

INSERT INTO public.users (id, first_name, username, photo_url, coins)
VALUES (
    123456789, 
    'Test User', 
    'test_user', 
    'https://telegram.org/img/t_logo.png',
    100
)
ON CONFLICT (id) DO UPDATE 
SET first_name = 'Test User Updated';

SELECT * FROM public.users WHERE id = 123456789;
