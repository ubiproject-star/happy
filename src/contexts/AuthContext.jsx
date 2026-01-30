
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useTelegram from '../hooks/useTelegram';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { tg, user: telegramUser } = useTelegram();
    const [user, setUser] = useState(null); // Database User
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    // OPTIMISTIC HYDRATION: Load Telegram data immediately to prevent UI flash/undefined
    useEffect(() => {
        if (telegramUser && !user) {
            console.log("AuthContext: Hydrating with Unsafe Telegram User (Optimistic)", telegramUser);
            setUser(telegramUser);
        }
    }, [telegramUser]); // Run when telegramUser becomes available

    const fetchUser = async (initData) => {
        if (!initData) {
            console.warn("AuthContext: No initData available");
            setLoading(false);
            return;
        }

        try {
            console.log("AuthContext: invoking auth-telegram...");
            const { data, error } = await supabase.functions.invoke('auth-telegram', {
                body: { initData },
            });

            if (error) {
                console.error("AuthContext: Edge Function Error:", error);
                throw error;
            }

            const { token, user: dbUser } = data;

            if (!dbUser || !dbUser.id) {
                console.error("AuthContext: No user returned from Edge Function", data);
                throw new Error("Invalid response from auth-telegram");
            }

            if (token) {
                supabase.realtime.setAuth(token);
                setSession({ access_token: token });

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
                    // alert("Warning: Profile sync delayed (DB Fetch Failed)");
                }
            }
        } catch (err) {
            console.error('Auth Sync Failed:', err);
            // alert(`Login Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tg.initData) {
            fetchUser(tg.initData);
        } else {
            console.warn("AuthContext: InitData missing on mount");
            setLoading(false);
        }
    }, [tg]);

    const refreshUser = () => {
        if (tg.initData) return fetchUser(tg.initData);
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};
