
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
                setUser(dbUser);
                setSession({ access_token: token });
                console.log('User synced:', dbUser.username);
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
