import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <h1 className="text-2xl">Lodgify</h1>
      <div>
        <Link className="mr-4" to="/">Home</Link>
        <Link className="mr-4" to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
};

export default NavBar;