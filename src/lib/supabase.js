import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase;

try {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase Environment Variables");
    }
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
    console.error("Supabase Initialization Error:", error);

    // Create a dummy client to prevent crash, but alert developer in console
    supabase = {
        from: () => ({
            select: () => Promise.resolve({ data: [], error: { message: "Supabase not configured" } }),
            insert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
            upsert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
            eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }) }),
            not: () => ({ limit: () => Promise.resolve({ data: [], error: { message: "Supabase not configured" } }) }),
        }),
        channel: () => ({
            on: () => ({ subscribe: () => { } })
        }),
        removeChannel: () => { }
    };
}

export { supabase };
