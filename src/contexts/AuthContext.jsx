
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useTelegram from '../hooks/useTelegram';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { tg, user: telegramUser } = useTelegram();
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    // DIRECT DB SYNC + SILENT AUTH
    const syncUserWithDB = async (tgUser) => {
        if (!tgUser) return;

        console.log("AuthContext: Starting Sync for ID", tgUser.id);

        try {
            // 1. SILENT AUTH (Populate Supabase Auth Users list)
            // We use the Telegram ID to create a unique email/password combo.
            // This is "Silent" because the user never types it.
            const email = `${tgUser.id}@telegram.happi.app`;
            const password = `tg_user_${tgUser.id}_secret_pass_7x`; // Simple fixed password for auto-login

            // Try sending sign up
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) {
                // If already registered, try sign in
                if (authError.message?.includes("already registered") || authError.status === 400 || authError.status === 422) {
                    console.log("AuthContext: User exists in Auth, signing in...");
                    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });
                    if (signInData?.session) {
                        setSession(signInData.session);
                        console.log("AuthContext: Silent Login Success");
                    } else if (signInError) {
                        console.warn("AuthContext: Silent Login Failed", signInError);
                    }
                } else {
                    console.warn("AuthContext: Silent Register Error:", authError);
                }
            } else if (authData?.session) {
                setSession(authData.session);
                console.log("AuthContext: Silent Register Success");
            }

            // 2. PUBLIC DB UPSERT (The Real Data for Profile Page)
            // Now we sync the actual profile data to the 'users' table

            // First, protect the 'coins' balance from being reset
            const { data: existingUser } = await supabase
                .from('users')
                .select('coins')
                .eq('id', String(tgUser.id))
                .single();

            const updates = {
                id: tgUser.id,
                username: tgUser.username,
                first_name: tgUser.first_name,
                last_name: tgUser.last_name,
                language_code: tgUser.language_code,
                updated_at: new Date().toISOString()
            };

            // Only give welcome bonus if they truly don't exist in DB
            if (!existingUser) {
                updates.coins = 100;
            }

            const { data: savedUser, error: upsertError } = await supabase
                .from('users')
                .upsert(updates)
                .select()
                .single();

            if (upsertError) {
                console.error("AuthContext: Upsert Failed", upsertError);
                setUser({ ...tgUser, _source: `Error: ${upsertError.message}` });
            } else {
                console.log("AuthContext: public.users Sync Success!", savedUser);
                setUser({ ...savedUser, _source: 'DB + Silent Auth (Full Sync)' });
            }

        } catch (err) {
            console.error("AuthContext: Critical Sync Error", err);
            setUser({ ...tgUser, _source: `Critical: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (telegramUser) {
            // Instant Optimistic Update for UI
            if (!user) {
                setUser({ ...telegramUser, _source: 'Optimistic (Client)' });
            }
            // Trigger the robust sync
            syncUserWithDB(telegramUser);
        } else {
            setLoading(false);
        }
    }, [telegramUser]);

    return (
        <AuthContext.Provider value={{ user, session, loading, refreshUser: () => syncUserWithDB(telegramUser) }}>
            {children}
        </AuthContext.Provider>
    );
};
