import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asfguipgiafjfgqzzoky.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZmd1aXBnaWFmamZncXp6b2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgwMzU0MDYsImV4cCI6MjAzMzYxMTQwNn0.Q9U0z8vo4BRNII-ufAWi6fjNdrR88aukpB6FD6gx_AY';

const supabase = createClient(supabaseUrl, supabaseKey);

export const signUp = async (email, password) => {
  return supabase.auth.signUp({ email, password });
};

export const signIn = async (email, password) => {
  return supabase.auth.signInWithPassword({ email, password });
};