import { supabase } from "./supabaseClient";

export const signUp = async (email, password) => {
  return await supabase.auth.signUp({ email, password });
};

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const getUser = () => {
  return supabase.auth.user();
};