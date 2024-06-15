import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../assets/UserContext.jsx';
import '../index.css';

const Profile = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingSurname, setIsEditingSurname] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSurname, setNewSurname] = useState('');
  // profile image paths (predefined for simplicity)
  const imagePaths = [
    '/profile/profile-img1.png',
    '/profile/profile-img2.png',
    '/profile/profile-img3.png',
    '/profile/profile-img4.png',
    '/profile/profile-img-cat.png',
    '/profile/profile-img-rabbit.png',
    '/profile/profile-img-meme.jpeg',
  ];

  // fetch user profile and listings on user change
  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserListings();
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
      setNewName(data.name);
      setNewSurname(data.surname);
      setMessage('Profile fetched successfully');
    }
  };

  const fetchUserListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error.message);
      setMessage('Error fetching listings.');
    }
  };
  
  const handleImageChange = async () => {
    // Update profile image in the database
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ image: selectedImage })
        .eq('email', user.email);

      if (error) {
        throw error;
      }
      // Update profile image in the state
      setMessage('Profile image updated successfully');
      setProfile(prevProfile => ({ ...prevProfile, image: selectedImage }));
    } catch (error) {
      console.error('Error updating profile image:', error.message);
      setMessage('Error updating profile image.');
    }
  };

  const handleNameChange = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ name: newName })
        .eq('email', user.email);

      if (error) {
        throw error;
      }

      setMessage('Profile name updated successfully');
      setProfile(prevProfile => ({ ...prevProfile, name: newName }));
      setIsEditingName(false);
    } catch (error) {
      console.error('Error updating profile name:', error.message);
      setMessage('Error updating profile name.');
    }
  };

  const handleSurnameChange = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ surname: newSurname })
        .eq('email', user.email);

      if (error) {
        throw error;
      }

      setMessage('Profile surname updated successfully');
      setProfile(prevProfile => ({ ...prevProfile, surname: newSurname }));
      setIsEditingSurname(false);
    } catch (error) {
      console.error('Error updating profile surname:', error.message);
      setMessage('Error updating profile surname.');
    }
  };
  // if not logged in, display message to sign in
  if (!profile) {
    return (
      <div>
        <h2 className='font-bold'>Profile</h2>
        <p>
          You are not logged in. Please sign in here: 
          <Link to="/login">Login</Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className='font-bold'>Profile</h2>
      <p>{message}</p>
      {/* Profile Picture */}
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
      {/* User Data Display with Edit */}
      <div>
        <p>Email: {profile.email}</p>
        <p>
          Name: {isEditingName ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          ) : (
            profile.name
          )}
          <button onClick={() => (isEditingName ? handleNameChange() : setIsEditingName(true))}>
            {isEditingName ? 'Save' : 'Edit'}
          </button>
        </p>
        <p>
          Surname: {isEditingSurname ? (
            <input
              type="text"
              value={newSurname}
              onChange={(e) => setNewSurname(e.target.value)}
            />
          ) : (
            profile.surname
          )}
          <button onClick={() => (isEditingSurname ? handleSurnameChange() : setIsEditingSurname(true))}>
            {isEditingSurname ? 'Save' : 'Edit'}
          </button>
        </p>
      </div>
      {/* User Listings */}
      <div>
        <h2 className='font-bold'>Your Places</h2>
        {Array.isArray(listings) && listings.length > 0 ? (
          listings.map(listing => (
            <div key={listing.id} className="p-4 border-b">
              <h3>{listing.name}</h3>
              <p>{listing.address}</p>
              <p>{listing.country}</p>
              <p>${listing.price} per night</p>
              <p>{listing.guests}</p>
              <Link to={`/profile/listing/${listing.id}`}>View Details</Link>
            </div>
          ))
        ) : (
          <p>You have no listings yet...</p>
        )}
        <Link to="/add">Add a listing</Link>
      </div>
    </div>
  );
};

export default Profile;