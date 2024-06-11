import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { getUser } from '../auth';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const session = await getUser();
    if (session) {
      const userEmail = session.user.email;
  
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .single();
  
      if (error) {
        console.error('Error fetching profile:', error.message);
        setMessage('Error fetching profile.');
      } else {
        setUser(data);
        setMessage('Profile fetched successfully');
      }
    } else {
      setMessage('No user session found.');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>{message}</p>
      <div>
        <p>Email: {user.email}</p>
        <p>Name: {user.name}</p>
        <p>Surname: {user.surname}</p>
      </div>
    </div>
  );
};

export default Profile;