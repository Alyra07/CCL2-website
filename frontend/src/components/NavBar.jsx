import React, { useState } from 'react';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import { useUser } from '../assets/UserContext';
import { signOut } from '../assets/auth';
// Material UI Icons
import HotelRoundedIcon from '@mui/icons-material/HotelRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const NavBar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect to login page after logout and reset user context
      navigate('/login');
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  const handleLinkClick = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="relative flex items-center p-2 bg-primary text-white">
      <div className="flex items-center flex-grow">
        <NavLink
          to="/list"
          className="flex items-center mx-4 p-1 bg-primary hover:bg-accent rounded-lg"
        >
          <HotelRoundedIcon fontSize='large' />
          <span className="ml-2 hidden sm:inline hidden xs:inline">Find Stays</span>
        </NavLink>
        {user && (
          <NavLink
            to="/favorites"
            className="flex items-center mx-4 p-1 bg-primary hover:bg-accent rounded-lg"
          >
            <FavoriteRoundedIcon fontSize='large' />
            <span className="ml-2 hidden sm:inline hidden xs:inline">Favorites</span>
          </NavLink>
        )}
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link to="/" className="flex items-center mx-auto">
          <img className="w-14 h-14" src="/travel-logo.jpg" alt="logo" />
        </Link>
      </div>
      <div className="flex items-center ml-auto relative">
        {user && (
          <NavLink
            to="/add"
            className="flex items-center mx-4 p-1 bg-primary hover:bg-accent rounded-lg"
          >
            <MeetingRoomRoundedIcon fontSize='large' />
            <span className="ml-2 hidden sm:inline hidden xs:inline">Become Host</span>
          </NavLink>
        )}
        <button onClick={toggleDropdown} className="p-1 focus:outline-none hover:bg-accent relative mx-4 rounded-lg">
          <AccountCircleRoundedIcon fontSize='large' />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 py-2 w-48 bg-primary rounded-lg shadow-xl z-20">
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={handleLinkClick}
                  className="block px-4 py-2 text-white hover:bg-secondary"
                >
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={handleLinkClick}
                  className="block px-4 py-2 text-white hover:bg-secondary"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={handleLinkClick}
                  className="block px-4 py-2 text-white hover:bg-secondary"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;