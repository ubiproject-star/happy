import { createClient } from '@supabase/supabase-js'

// Credentials provided in steps
const supabaseUrl = 'https://shwpblroitsxezihnaut.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNod3BibHJvaXRzeGV6aWhuYXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1ODU5MjYsImV4cCI6MjA4NTE2MTkyNn0.apZIGddJI_eOZxpq5pQTW8_EOfl_A517f_0djGq86Dw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
