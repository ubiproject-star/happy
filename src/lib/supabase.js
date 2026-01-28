import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase Environment Variables are missing!");
    // Alert only in development or if critical
    if (import.meta.env.PROD) {
        console.error("Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Vercel Project Settings.");
    }
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
