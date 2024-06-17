import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../assets/UserContext.jsx';
import '../index.css';

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
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

  const handleListingClick = (id) => {
    // Pass listing id to DetailsListing page
    navigate(`/profile/listing/${id}`);
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

  // default return if user is logged in
  return (
    <div className="p-4 md:p-10 lg:p-16">
      <div className="text-center">
        <h2 className="font-semibold text-primary text-3xl">
          Profile
        </h2>
        <p className="text-green-500">{message}</p>
      </div>
      {/* Profile data display */}
      {profile && (
        <div className="rounded-lg bg-tertiary p-6 mx-auto w-full md:w-2/3 lg:w-1/2">
          {/* Profile image */}
          <div className="text-center mb-4">
            <img src={profile.image} alt="Profile"
              className="w-64 h-auto border border-secondary rounded-lg mx-auto mb-4" />
            <label className="block mb-2">Select Profile Picture:</label>
            <select
              value={selectedImage}
              onChange={(e) => setSelectedImage(e.target.value)}
              className="border p-2 rounded mb-4"
            >
              <option value="">Select an image</option>
              {imagePaths.map((path, index) => (
                <option key={index} value={path}>{`Image ${index + 1}`}</option>
              ))}
            </select>
            <button
              onClick={handleImageChange}
              className="bg-primary text-white p-2 ml-2 rounded-lg hover:bg-secondary transition duration-300"
            >
              Set Profile Picture
            </button>
          </div>

          {/* User Data Display with Edit */}
          <div className="flex justify-center items-center mb-4">
            <div className="flex flex-col">
              <div className="justify-center">
                <p className="text-lg font-semibold">Email: {profile.email}</p>
                <p className="text-lg font-semibold">
                  Name: {isEditingName ? (
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="border p-2 rounded"
                    />
                  ) : (
                    profile.name
                  )}
                  <button
                    onClick={() => (isEditingName ? handleNameChange() : setIsEditingName(true))}
                    className="mx-4 my-2 bg-accent text-base text-white py-1 px-2 rounded-lg hover:bg-red-300"
                  >
                    {isEditingName ? 'Save' : 'Edit'}
                  </button>
                </p>
                <p className="text-lg font-semibold">
                  Surname: {isEditingSurname ? (
                    <input
                      type="text"
                      value={newSurname}
                      onChange={(e) => setNewSurname(e.target.value)}
                      className="border p-2 rounded"
                    />
                  ) : (
                    profile.surname
                  )}
                  <button
                    onClick={() => (isEditingSurname ? handleSurnameChange() : setIsEditingSurname(true))}
                    className="mx-4 bg-accent text-base text-white py-1 px-2 rounded-lg hover:bg-red-300"
                  >
                    {isEditingSurname ? 'Save' : 'Edit'}
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* User Listings "Your Places" */}
          <div className="mb-2 text-center">
            <h2 className="font-bold text-2xl my-6">Your Places</h2>
            {Array.isArray(listings) && listings.length > 0 ? (
              <div className="flex justify-center">
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-8">
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      className="w-48 bg-light-gray rounded-lg overflow-hidden shadow-lg 
                                transform transition-transform duration-300 hover:scale-105"
                      onClick={() => handleListingClick(listing.id)}
                    >
                      <img
                        src={listing.images?.[0] || '/img/placeholder2.jpg'}
                        alt={listing.name}
                        className="w-full h-52 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{listing.name}</h3>
                        <p className="text-gray-700">{listing.address}</p>
                        <p className="text-gray-700">{listing.country}</p>
                        <p className="text-gray-700">${listing.price} per night</p>
                        <p className="text-gray-700">{listing.guests} guests</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center">You have no listings yet...</p>
            )}
          </div>
        </div>
      )}
      <div className="my-4 text-center">
        <Link
          to="/add"
          className="bg-accent text-white py-2 px-4 rounded-lg hover:bg-red-300 transition duration-300"
        >
          Add a listing
        </Link>
      </div>
    </div>
  );

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
};

export default Profile;