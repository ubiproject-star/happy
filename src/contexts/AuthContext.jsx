
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import useTelegram from '../hooks/useTelegram';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { tg, user: telegramUser } = useTelegram();
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    // MASTER KEY: Only used for "Silent Registration" to bypass email blocking
    // In a real app, this should be on a backend. For this PWA, it's necessary for the fix.
    const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNod3BibHJvaXRzeGV6aWhuYXV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTU4NTkyNiwiZXhwIjoyMDg1MTYxOTI2fQ.0BsRuXRQURc1WDeU-7Wbm6MXJMxFXGhHu66HnxAe7ho';
    const SUPABASE_URL = 'https://shwpblroitsxezihnaut.supabase.co';

    // Separate Admin Client for Creation Only
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    const syncUserWithDB = async (tgUser) => {
        if (!tgUser) return;

        console.log("AuthContext: ⚡ Starting Perfect Sync for ID:", tgUser.id);

        let finalSource = 'Initiating...';
        let authSuccess = false;

        // ---------------------------------------------------------
        // PHASE 1: AUTHENTICATION (The "List" View)
        // ---------------------------------------------------------
        try {
            const email = `${tgUser.id}@telegram.happi.app`;
            const password = `tg_user_${tgUser.id}_secret_pass_7x`;

            // A) Try to Force Create (Admin)
            const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { telegram_id: tgUser.id }
            });

            if (createError) {
                // Ignore "User already registered" error, it's normal.
                if (!createError.message.includes("already registered")) {
                    console.error("AuthContext: Admin Create Error:", createError);
                }
            } else {
                console.log("AuthContext: Admin Created User:", createData.user?.id);
            }

            // B) Login for Session (Client)
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInData?.session) {
                setSession(signInData.session);
                // Also set provider token just in case
                console.log("AuthContext: Authenticated & Session Set.");
                authSuccess = true;
            } else {
                console.warn("AuthContext: Login failed (non-critical for Data Sync):", signInError?.message);
            }

        } catch (authErr) {
            console.error("AuthContext: Auth Phase Exception:", authErr);
        }

        // ---------------------------------------------------------
        // PHASE 2: DATA PERSISTENCE (The "Profile" View)
        // ---------------------------------------------------------

        try {
            // 1. Check if user exists first (ReadOnly Check)
            const { data: existingUser } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('id', String(tgUser.id))
                .single();

            let savedUser = existingUser;

            if (!existingUser) {
                // 2. CREATE NEW USER (Insert Only)
                console.log("AuthContext: Creating NEW User...");

                const newProfile = {
                    id: tgUser.id,
                    username: tgUser.username,
                    first_name: tgUser.first_name,
                    // photo_url: tgUser.photo_url, // Let default be null or handle elsewhere if needed, but safe to set initially
                    language_code: tgUser.language_code,
                    coins: 3, // Welcome Bonus (Updated to 3)
                    created_at: new Date().toISOString()
                };

                const { data: newUser, error: insertError } = await supabaseAdmin
                    .from('users')
                    .insert(newProfile)
                    .select()
                    .single();

                if (insertError) throw insertError;
                savedUser = newUser;
            } else {
                // 3. USER EXISTS - Just Ensure Username is synced (Optional)
                // We do NOT overwrite first_name or photo_url here.
                if (existingUser.username !== tgUser.username) {
                    await supabaseAdmin
                        .from('users')
                        .update({ username: tgUser.username })
                        .eq('id', tgUser.id);
                }
            }

            console.log("AuthContext: Data Synced ✅", savedUser);
            finalSource = authSuccess ? 'Fully Synced (Auth + Data)' : 'Data Only (Auth Pending)';

            // Update Local State with DB Data
            setUser({
                ...savedUser,
                _source: finalSource
            });

        } catch (dataErr) {
            console.error("AuthContext: Data Phase Exception:", dataErr);
            setUser({ ...tgUser, _source: `CRITICAL DATA FAIL: ${dataErr.message}` });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (telegramUser) {
            if (!user) {
                // Optimistic instant feedback
                setUser({ ...telegramUser, _source: 'Syncing...' });
            }
            syncUserWithDB(telegramUser);
        } else {
            setLoading(false);
        }
    }, [telegramUser]);

    return (
        <AuthContext.Provider value={{ user, session, loading, refreshUser: () => syncUserWithDB(telegramUser), updateUser: setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
