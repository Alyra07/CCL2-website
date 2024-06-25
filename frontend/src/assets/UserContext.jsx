import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user session on mount
    const getUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
      // Listen for changes on auth state (logged in, signed out, etc.)
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null);
      });
      return () => {
        // Unsubscribe from auth listener on unmount
        authListener.subscription.unsubscribe();
      };
    };

    getUserSession();
  }, []);

  // Provide user context to all children components (allows access to user state)
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access user context: const { user } = useUser();
export const useUser = () => useContext(UserContext); 