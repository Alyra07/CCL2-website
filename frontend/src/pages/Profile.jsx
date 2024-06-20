import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../assets/UserContext.jsx';
import ListingCard from '../components/ListingCard';
import '../index.css';

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [profileName, setProfileName] = useState(''); // Display name in heading
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingSurname, setIsEditingSurname] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSurname, setNewSurname] = useState('');

  const profileImages = [
    '/profile/profile-img1.png',
    '/profile/profile-img2.png',
    '/profile/profile-img3.png',
    '/profile/profile-img4.png',
    '/profile/profile-img-cat.png',
    '/profile/profile-img-rabbit.png',
    '/profile/profile-img-meme.jpeg',
  ];

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserListings();
    }
  }, [user]);

  // Fetch user profile data
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
      setProfileName(data.name);
      setNewName(data.name);
      setNewSurname(data.surname);
      // setMessage('profile fetched successfully');
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
    navigate(`/profile/listing/${id}`);
  };

  const handleImageChange = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ image: selectedImage })
        .eq('email', user.email);

      if (error) {
        throw error;
      }

      setProfile(prevProfile => ({ ...prevProfile, image: selectedImage }));
    } catch (error) {
      console.error('Error updating profile image:', error.message);
      setMessage('Error updating profile image.');
    }
  };

  const handleNameAndSurnameChange = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ name: newName, surname: newSurname })
        .eq('email', user.email);
  
      if (error) {
        throw error;
      }
  
      setProfile(prevProfile => ({ ...prevProfile, name: newName, surname: newSurname }));
      setProfileName(newName);
      setIsEditingName(false);
      setIsEditingSurname(false);
    } catch (error) {
      console.error('Error updating profile:', error.message);
      setMessage('Error updating profile.');
    }
  };

  return (
    <div className="pt-4 md:pt-10 lg:pt-16">
      <div className="text-center">
        <h2 className="font-semibold text-primary text-3xl">
          {profileName ? `${profileName}'s Profile` : 'Profile'}
        </h2>
      </div>
      {/* Display Profile if profile is set */}
      {profile && (
        <div className="flex flex-col lg:flex-row mx-4 md:mx-12 justify-center
              bg-tertiary p-2 lg:p-8 my-2 lg:my-4 rounded-xl lg:rounded-full ">
          {/* Display Profile Data (lg:left col) */}
          <div className="flex flex-col lg:w-1/4 md:mb-2">
            <p className="text-accentred text-center text-lg">{message}</p>
            {/* Profile Image */}
            <div className="text-center mb-4">
              <img
                src={profile.image}
                alt="Profile"
                className="w-80 h-auto border border-secondary rounded-lg mx-auto mb-4"
              />
              <label className="block mb-2">Select Profile Picture:</label>
              <select
                value={selectedImage}
                onChange={(e) => setSelectedImage(e.target.value)}
                className="border p-2 rounded mb-4"
              >
                <option value="">Select an image</option>
                {profileImages.map((path, index) => (
                  <option key={index} value={path}>{`Image ${index + 1}`}</option>
                ))}
              </select>
              <button
                onClick={handleImageChange}
                className="bg-primary text-white p-2 ml-2 md:ml-0 lg:ml-2 rounded-lg hover:bg-secondary transition duration-300"
              >
                Set Profile Picture
              </button>
            </div>
            {/* User email & name */}
            <div className="flex justify-center">
              <div className="flex flex-col">
                <p className="text-xl"><strong>E-Mail: </strong>{profile.email}</p>
                <p className="text-xl">
                  <strong>Name:  </strong>{isEditingName ? (
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="border p-2 rounded"
                    />
                  ) : (
                    profile.name
                  )}
                </p>
                <p className="text-xl">
                <strong>Surname:  </strong>{isEditingSurname ? (
                    <input
                      type="text"
                      value={newSurname}
                      onChange={(e) => setNewSurname(e.target.value)}
                      className="border p-2 rounded"
                    />
                  ) : (
                    profile.surname
                  )}
                </p>
                {/* Single Edit/Save Button */}
                <button
                  onClick={() => {
                    if (isEditingName || isEditingSurname) {
                      handleNameAndSurnameChange();
                    } else {
                      setIsEditingName(true);
                      setIsEditingSurname(true);
                    }
                  }}
                  className="mx-auto bg-accent text-base text-white py-1 px-2 mt-2 rounded-lg hover:bg-red-300"
                >
                  {isEditingName || isEditingSurname ? 'Save Name' : 'Edit Name'}
                </button>
              </div>
            </div>
          </div>

          {/* User Listings (lg: right col) */}
          <div className="flex flex-col justify-center items-center mt-4 md:mt-0 mx-auto md:w-2/3">
            <h2 className="font-bold text-primary text-2xl mb-2 mt-2 lg:mt-0">Your Places</h2>
            <hr className="w-1/2 border border-secondary mb-4" />
            {Array.isArray(listings) && listings.length > 0 ? (
              // ListingCard Grid
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {listings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      user={user}
                      handleClick={handleListingClick}
                      showAddFavorite={false} // hide AddFavorite button
                    />
                  ))}
                </div>
          
            ) : (
              <p className="text-gray-700">You have no listings yet.</p>
            )}
            {/* Add listing Button */}
            <div className="mt-6 text-center">
              <Link
                to="/add"
                className="bg-accent text-white py-2 px-4 rounded-lg hover:bg-red-300 transition duration-300"
              >
                Add a listing
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Display if no profile is set (no user logged in) */}
      {!profile && (
        <div className="text-center m-8">
          <p>
            You are not logged in. Please sign in here:{' '}
            <Link
              to="/login"
              className="bg-accent text-white py-2 px-4 rounded-lg hover:bg-red-300 transition duration-300"
            >
              Login
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;