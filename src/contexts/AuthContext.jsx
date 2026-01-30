
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useTelegram from '../hooks/useTelegram';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { tg } = useTelegram();
    const [user, setUser] = useState(null); // Database User
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const login = async () => {
            // 1. Check if we have initData (we are in Telegram)
            const initData = tg.initData;

            if (!initData) {
                console.warn('No initData found. Are you running in Telegram?');
                setLoading(false);
                return;
            }

            try {
                // 2. Call Supabase Edge Function to verify and get token
                // We use the PROJECT URL + /functions/v1/auth-telegram
                const { data, error } = await supabase.functions.invoke('auth-telegram', {
                    body: { initData },
                });

                if (error) throw error;

                const { token, user: dbUser } = data;

                if (token) {
                    // 3. Set the custom session in Supabase (if we were using GoTrue, but here we might just store it)
                    // Since we are using Custom Auth, we might need to include this token in RLS requests manually
                    // OR use supabase.auth.setSession if the token is compatiable.
                    // For this implementation, we will assume the Edge Function returns a signed JWT 
                    // that works with Supabase Auth.

                    /* 
                       NOTE: Standard Supabase 'setSession' requires a refresh token usually.
                       For Telegram Apps, typically we set the global headers or handle state manually.
                       However, if the Edge Function mints a valid Supabase Access Token, we can use it.
                    */

                    // Simple approach: Set global headers for subsequent requests
                    supabase.realtime.setAuth(token); // For realtime
                    // For Rest calls, we can try to set it, but verify if setSession works with just access_token

                    /* 
                       ACTUALLY, normally with Telegram Web Apps and Supabase, 
                       we rely on Anonymous Auth for public reading OR we just use the user ID 
                       validated by the Edge Function for critical actions.
                       
                       BUT db.txt requested "Special JWT mechanism".
                       The simplest way is: 
                    */

                    setUser(dbUser);
                    setSession({ access_token: token });
                    console.log('Logged in as:', dbUser.username);
                }

            } catch (err) {
                console.error('Telegram Login Failed:', err);
            } finally {
                setLoading(false);
            }
        };

        login();
    }, [tg]);

    return (
        <AuthContext.Provider value={{ user, session, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
