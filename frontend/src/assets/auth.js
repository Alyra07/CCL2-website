import { supabase } from "../supabaseClient";

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

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  const { user, error } = await supabase.auth.api.getUser(token);

  if (error) {
    return res.status(401).send('Unauthorized');
  }

  req.user = user;
  next();
};