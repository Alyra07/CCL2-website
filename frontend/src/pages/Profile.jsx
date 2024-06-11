import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../UserContext';
import '../index.css';

const Profile = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const imagePaths = [
    '/img/profile-img1.png',
    '/img/profile-img2.png',
    '/img/profile-img3.png',
    '/img/profile-img4.png',
    '/img/profile-img-cat.png',
    '/img/profile-img-rabbit.png',
    '/img/profile-img-meme.jpeg',
  ];

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

  const handleImageChange = async () => {
    try {
      // Update user profile with selected image
      const { data, error } = await supabase
        .from('users')
        .update({ image: selectedImage })
        .eq('email', user.email);

      if (error) {
        throw error;
      }

      setMessage('Profile image updated successfully');
    } catch (error) {
      console.error('Error updating profile image:', error.message);
      setMessage('Error updating profile image.');
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
          <p>Profile Picture:</p>
          <img src={profile.image} alt="Profile" style={{ width: '300px', height: '300px' }} />
        
        <label>Select Profile Picture:</label>
        <select value={selectedImage} onChange={(e) => setSelectedImage(e.target.value)}>
          <option value="">Select an image</option>
          {imagePaths.map((path, index) => (
            <option key={index} value={path}>{index + 1}</option>
          ))}
        </select>
        <button onClick={handleImageChange}>Set Profile Picture</button>
      </div>
      <div>
        <p>Email: {profile.email}</p>
        <p>Name: {profile.name}</p>
        <p>Surname: {profile.surname}</p>
      </div>
    </div>
  );
};

export default Profile;