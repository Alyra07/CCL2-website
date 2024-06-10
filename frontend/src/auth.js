import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asfguipgiafjfgqzzoky.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZmd1aXBnaWFmamZncXp6b2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgwMzU0MDYsImV4cCI6MjAzMzYxMTQwNn0.Q9U0z8vo4BRNII-ufAWi6fjNdrR88aukpB6FD6gx_AY';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signUp = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { user, error };
};

export const signIn = async (email, password) => {
  const { user, error } = await supabase.auth.signIn({
    email,
    password,
  });
  return { user, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};