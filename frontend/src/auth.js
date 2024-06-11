import { supabase } from "./supabaseClient";

export const signUp = async (email, password) => {
  return await supabase.auth.signUp({ email, password });
};

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async (email, password) => {
  return await supabase.auth.signOut({ email, password });
};

export const getUser = () => {
  return supabase.auth.user();
};