
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
                const userIdStr = String(dbUser.id);
                console.log("AuthContext: Force-fetching for ID:", userIdStr);

                const { data: freshUser, error: refreshError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', userIdStr)
                    .single();

                if (freshUser && !refreshError) {
                    console.log('AuthContext: Force-refresh SUCCESS. New Photo:', freshUser.photo_url);
                    setUser(freshUser);
                } else {
                    console.error('AuthContext: Force-refresh FAILED:', refreshError);
                    // Fallback to the edge function data, but warn
                    setUser(dbUser);
                    alert("Warning: Profile sync might be delayed. Please reload.");
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
