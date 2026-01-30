
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

    const fetchUser = async (initData) => {
        if (!initData) return;
        try {
            const { data, error } = await supabase.functions.invoke('auth-telegram', {
                body: { initData },
            });
            if (error) throw error;
            const { token, user: dbUser } = data;
            if (token) {
                supabase.realtime.setAuth(token);

                // FORCE RE-FETCH: Don't trust the Edge Function's return value blindly for mutable fields
                const { data: freshUser, error: refreshError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', dbUser.id)
                    .single();

                if (freshUser && !refreshError) {
                    console.log('Force-refreshed User Data:', freshUser);
                    setUser(freshUser);
                } else {
                    console.warn('Refresh failed, using Edge Function data');
                    setUser(dbUser);
                }

                setSession({ access_token: token });
            }
        } catch (err) {
            console.error('Auth Sync Failed:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tg.initData) fetchUser(tg.initData);
        else setLoading(false);
    }, [tg]);

    const refreshUser = () => fetchUser(tg.initData);

    return (
        <AuthContext.Provider value={{ user, session, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};
