
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

    // DIRECT DB SYNC (No Edge Function)
    const syncUserWithDB = async (tgUser) => {
        if (!tgUser) return;

        console.log("AuthContext: Starting Direct DB Sync for", tgUser.id);

        try {
            // 1. Try to fetch existing user
            let { data: dbUser, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('id', String(tgUser.id))
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                // Real error (not just "not found")
                console.error("AuthContext: Fetch Error", fetchError);
            }

            // 2. If not found, or to update basic fields, UPSERT
            // We only update "synced" fields, preserving user-defined ones like bio/gender
            const updates = {
                id: tgUser.id,
                username: tgUser.username,
                first_name: tgUser.first_name,
                last_name: tgUser.last_name,
                language_code: tgUser.language_code,
                // photo_url: tgUser.photo_url, // OPTIONAL: Do not overwrite if we want custom photos? 
                // Let's set it only if it's new.
                updated_at: new Date().toISOString()
            };

            // If new user, set default fields
            if (!dbUser) {
                updates.coins = 100; // Welcome bonus
            }

            const { data: savedUser, error: upsertError } = await supabase
                .from('users')
                .upsert(updates)
                .select()
                .single();

            if (upsertError) {
                console.error("AuthContext: Upsert Failed", upsertError);
                // Show specific error in debug source
                setUser({ ...tgUser, _source: `Error: ${upsertError.message || upsertError.code}` });
            } else {
                console.log("AuthContext: Sync Success!", savedUser);
                setUser({ ...savedUser, _source: 'DB (Direct Client)' });
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
            // Instant Optimistic Update
            if (!user) {
                setUser({ ...telegramUser, _source: 'Optimistic (Client)' });
            }
            // Trigger Background Sync
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
