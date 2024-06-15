import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="flex flex-row p-4 bg-primary text-white fixed bottom-0 left-0 right-0">
      <div className="flex flex-grow items-center">
        <a href="/">
          <img className="w-10 h-10 mr-2" 
          src="/travel-logo.jpg" 
          alt="hotel room icon" />
        </a>
        <Link className="mx-4" to="/contact">Contact Us</Link>
        <Link className="mx-4" to="/about">About Us</Link>
        <Link className="mx-4" to="/terms">Terms of Service</Link>
        <Link className="mx-4" to="/privacy">Privacy Policy</Link>
      </div>
    </footer>
  );
};

export default Footer;