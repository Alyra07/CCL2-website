import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient.js';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }

      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    getUserSession();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);