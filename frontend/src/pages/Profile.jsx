import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../assets/UserContext.jsx';
import ListingCard from '../components/ListingCard';
// MUI Icons & components
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

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
  // ListingCard slider states
  const [slideIn, setSlideIn] = useState(true);
  const [slideDirection, setSlideDirection] = useState('right');
  const [currentPage, setCurrentPage] = useState(0);
  const maxListingsPerPage = 4;
  const totalPages = Math.ceil(listings.length / maxListingsPerPage);

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
    }
  };

  // Fetch user listings
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

  // Navigate to listing details page
  const handleListingClick = (id) => {
    navigate(`/profile/listing/${id}`);
  };

  // Update profile image
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

  // Handle name and surname change
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

  // Handle arrow click for sliding listings
  const handleArrowClick = (direction) => {
    const increment = direction === 'left' ? -1 : 1;
    let newPage = currentPage + increment;
    if (newPage >= totalPages) {
      newPage = 0; // Loop back to the first page if we go over
      setSlideDirection('left');
    } else if (newPage < 0) {
      newPage = totalPages - 1; // Loop to the last page if we go below 0
      setSlideDirection('right');
    }
    setCurrentPage(newPage);
  };
  // set ListingCard slider states - Listings to display on current page
  const startIndex = currentPage * maxListingsPerPage;
  const endIndex = startIndex + maxListingsPerPage;
  const listingsToDisplay = listings.slice(startIndex, endIndex);

  return (
    <div className="pt-4 md:pt-10 lg:pt-16">
      <div className="text-center">
        <h2 className="font-semibold text-primary text-3xl">
          {profileName ? `${profileName}'s Profile` : 'Profile'}
        </h2>
      </div>
      {/* Display Profile if profile is set */}
      {profile && (
        <div className="flex flex-col lg:flex-row md:mx-12 justify-center bg-tertiary p-2 lg:p-8 my-2 lg:my-4 rounded-xl lg:rounded-full">
          <div className="flex flex-col lg:w-2/5 md:mb-2 justify-center">
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
                {/* Edit/Save Name Button */}
                <button
                  onClick={() => {
                    if (isEditingName || isEditingSurname) {
                      handleNameAndSurnameChange();
                    } else {
                      setIsEditingName(true);
                      setIsEditingSurname(true);
                    }
                  }}
                  className="mx-auto bg-accent text-base text-white py-1 px-2 mt-4 rounded-lg hover:bg-red-300"
                >
                  {isEditingName || isEditingSurname ? 'Save Name' : 'Edit Name'}
                </button>
              </div>
            </div>
          </div>
          {/* User Listings */}
          <div className="flex flex-col justify-center items-center mt-4 md:mt-0 mx-auto lg:w-2/3">
            <h2 className="font-bold text-primary text-2xl mb-2 mt-2 lg:mt-0">Your Places</h2>
            <hr className="w-1/2 border border-secondary mb-4" />
            {/* ListingCard gallery with arrow buttons */}
            {Array.isArray(listings) && listings.length > 0 ? (
                <Box // 2x2 grid on mobile and 1 row of 4 listings on large screens
                  className="listing-grid"
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                    gap: 2,
                  }}
                >
                  <Box // span 4 columns on large screens
                    sx={{
                      gridColumn: { xs: '1 / span 2', lg: '1 / span 4' },
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {/* Hide the left arrow if on the first page */}
                    {currentPage > 0 && (
                      <IconButton onClick={() => handleArrowClick('left')}>
                        <ArrowBackIosRoundedIcon />
                      </IconButton>
                    )}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                        gap: 2,
                        width: '100%',
                      }}
                    >
                      {listingsToDisplay.map((listing) => (
                        <Slide
                          key={listing.id}
                          in={slideIn}
                          direction={slideDirection}
                          mountOnEnter
                          unmountOnExit
                        >
                          <Box
                            className= 'md:max-w-64'>
                            <ListingCard
                              listing={listing}
                              user={user}
                              handleClick={handleListingClick}
                              showAddFavorite={false}
                            />
                          </Box>
                        </Slide>
                      ))}
                    </Box>
                    {/* Hide the right arrow if on the last page */}
                    {currentPage < totalPages - 1 && (
                      <IconButton onClick={() => handleArrowClick('right')}>
                        <ArrowForwardIosRoundedIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
            ) : (
              <p className="text-lg text-gray-700">You have no listings yet.</p>
            )}

            {/* Add listing Button */}
            <div className="mb-4 mt-6 text-center">
              <Link
                to="/add"
                className="bg-accent text-white py-2 px-4 rounded-lg hover:bg-red-300 transition duration-300"
              >
                {listings.length > 0 ? 'Add Listing' : 'Become A Host'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Display if no profile is set (no user logged in) */}
      {!profile && (
        <div className="text-xl text-center m-8">
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