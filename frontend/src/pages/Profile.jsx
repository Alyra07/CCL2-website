import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../assets/UserContext';

const Profile = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (error) {
      console.error('Error fetching profile:', error.message);
      setMessage('Error fetching profile.');
    } else {
      setProfile(data);
      setMessage('Profile fetched successfully');
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>{message}</p>
      <div>
        <p>Email: {profile.email}</p>
        <p>Name: {profile.name}</p>
        <p>Surname: {profile.surname}</p>
      </div>
    </div>
  );
};

export default Profile;