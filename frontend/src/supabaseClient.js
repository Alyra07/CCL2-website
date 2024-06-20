import { createClient } from '@supabase/supabase-js'

// Database URL and anonymous key (Supabase)
const url = import.meta.env.VITE_DB_URL
const databaseKey = import.meta.env.VITE_DB_ANON_KEY

export const supabase = createClient(url, databaseKey);