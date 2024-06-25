import { supabase } from "../supabaseClient";

// Register a new user
export const signUp = async (email, password) => {
  return await supabase.auth.signUp({ email, password });
};
// Login
export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};
// Logout
export const signOut = async (email, password) => {
  return await supabase.auth.signOut({ email, password });
};

// Get currently authenticated user
export const getUser = () => {
  return supabase.auth.user();
};

// Token middleware
export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // Check if token exists
  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  // Get user from token
  const { user, error } = await supabase.auth.api.getUser(token);

  if (error) {
    return res.status(401).send('Unauthorized');
  }
  // Set user in request object
  req.user = user;
  next();
};