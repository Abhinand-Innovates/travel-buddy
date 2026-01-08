// src/components/Navbar.jsx
import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <a href="/" className="navbar-logo">
          Traval Buddy
        </a>

        {/* Hamburger Button (visible only on mobile) */}
        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <li><a href="/" onClick={() => setIsOpen(false)}>Home</a></li>
          <li><a href="/customerLogin" onClick={() => setIsOpen(false)}>Login</a></li>
          <li><a href="/customerSignup" onClick={() => setIsOpen(false)}>Signup</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;