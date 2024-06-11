import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/profile/${id}`);
        setProfile(response.data);
      } catch (error) {
        setMessage(`Failed to fetch profile: ${error.message}`);
      }
    };

    fetchProfile();
  }, [id]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {profile.email}</p>
      <p>Name: {profile.name}</p>
      <p>Surname: {profile.surname}</p>
      {/* Display other profile info as needed */}
      <p>{message}</p>
    </div>
  );
};

export default Profile;