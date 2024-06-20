import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="flex flex-row bg-primary text-white fixed bottom-0 left-0 right-0">
      <div className="flex flex-grow items-center">
        <a href="/">
          <img className="w-10 h-full mx-4" 
          src="/logo.png" 
          alt="hotel room icon" />
        </a>
        <Link className="p-4" to="/">CCL2</Link>
        <Link className="p-4" to="/">Project</Link>
        <Link className="p-4" to="/">by</Link>
        <Link className="p-4" to="/profile">Mirjam McLachlan</Link>
      </div>
    </footer>
  );
};

export default Footer;