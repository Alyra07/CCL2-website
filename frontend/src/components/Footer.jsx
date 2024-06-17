import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="flex flex-row bg-primary text-white fixed bottom-0 left-0 right-0">
      <div className="flex flex-grow items-center">
        <a href="/">
          <img className="w-14 h-14 mr-2" 
          src="/travel-logo.jpg" 
          alt="hotel room icon" />
        </a>
        <Link className="mx-4 p-2" to="/">CCL2</Link>
        <Link className="mx-4 p-2" to="/">Project</Link>
        <Link className="mx-4 p-2" to="/">by</Link>
        <Link className="mx-4 p-2" to="/profile">Mirjam McLachlan</Link>
      </div>
    </footer>
  );
};

export default Footer;