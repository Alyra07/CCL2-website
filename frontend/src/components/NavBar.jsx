import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="flex flex-row p-4 bg-cyan-600 text-white">
      <div className="flex flex-grow items-center">
        <a href="/">
        <img className="w-10 h-10 mr-2" 
        src="/img/travel-logo.jpg" 
        alt="hotel room icon" />
        </a>
        <Link className="mx-4" to="/list">Find Stays</Link>
        <Link className="mr-4" to="/add">Become A Host</Link>
      </div>
      <div className='flex flex-row items-center justify-right'>
        <Link className="mr-4" to="/">Home</Link>
        <Link className="mr-4" to="/login">Login</Link>
        <Link className="mr-4" to="/register">Register</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
};

export default NavBar;