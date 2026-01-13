import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFlashMessage } from '../context/FlashMessageContext';

const GuideNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showSuccess } = useFlashMessage();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    showSuccess('Logged out successfully');
    navigate('/guide/login');
    setIsDropdownOpen(false);
    setIsOpen(false);
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <style>{`
        .guide-navbar {
          width: 100%;
          height: 70px;
          background-color: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        .guide-navbar-container {
          max-width: 1200px;
          height: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .guide-navbar-logo {
          font-size: 1.6rem;
          font-weight: 700;
          color: #16a34a;
          text-decoration: none;
          cursor: pointer;
        }

        .guide-navbar-logo:hover {
          color: #15803d;
        }

        .guide-navbar-links {
          display: flex;
          list-style: none;
          gap: 32px;
          align-items: center;
        }

        .guide-navbar-links a {
          text-decoration: none;
          color: #1f2937;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .guide-navbar-links a:hover {
          color: #16a34a;
        }

        .guide-account-wrapper {
          position: relative;
        }

        .guide-account-icon {
          font-size: 1.5rem;
          cursor: pointer;
          user-select: none;
          transition: transform 0.2s ease;
        }

        .guide-account-icon:hover {
          transform: scale(1.1);
        }

        .guide-dropdown {
          position: absolute;
          right: 0;
          top: 45px;
          width: 200px;
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 6px 15px rgba(0,0,0,0.1);
          border-radius: 8px;
          overflow: hidden;
          z-index: 2000;
        }

        .guide-dropdown a,
        .guide-dropdown button,
        .guide-dropdown div {
          display: block;
          width: 100%;
          padding: 12px 16px;
          text-align: left;
          background: none;
          border: none;
          font-size: 0.95rem;
          cursor: pointer;
          color: #1f2937;
          text-decoration: none;
        }

        .guide-dropdown a:hover,
        .guide-dropdown button:hover {
          background-color: #f3f4f6;
        }

        .guide-dropdown-email {
          font-weight: 600;
          cursor: default;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .guide-logout-btn {
          color: #dc2626;
          font-weight: 500;
        }

        .guide-logout-btn:hover {
          background-color: #fee2e2 !important;
        }

        /* Hamburger */
        .guide-hamburger {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
        }

        .guide-hamburger span {
          width: 25px;
          height: 3px;
          background-color: #333;
          margin: 4px 0;
          transition: 0.3s;
        }

        .guide-hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(10px, 10px);
        }

        .guide-hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .guide-hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -7px);
        }

        @media (max-width: 768px) {
          .guide-hamburger {
            display: flex;
          }

          .guide-navbar-links {
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            background-color: white;
            flex-direction: column;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            gap: 0;
            border-bottom: 1px solid #e5e7eb;
          }

          .guide-navbar-links.active {
            max-height: 400px;
            padding: 20px 0;
          }

          .guide-navbar-links a,
          .guide-navbar-links li {
            padding: 12px 24px;
            border-bottom: 1px solid #f3f4f6;
          }

          .guide-navbar-links li {
            padding: 0;
          }

          .guide-account-wrapper {
            width: 100%;
          }

          .guide-account-wrapper > a {
            display: block;
            padding: 12px 24px;
            border-bottom: 1px solid #f3f4f6;
          }

          .guide-dropdown {
            position: static;
            width: 100%;
            box-shadow: none;
            border: none;
            border-top: 1px solid #f3f4f6;
            border-radius: 0;
          }

          .guide-dropdown a,
          .guide-dropdown button,
          .guide-dropdown div {
            padding: 12px 24px;
          }
        }
      `}</style>

      <nav className="guide-navbar">
        <div className="guide-navbar-container">
          {/* Logo */}
          <a href="/guide/dashboard" className="guide-navbar-logo">
            Travel Buddy
          </a>

          {/* Hamburger */}
          <button
            className={`guide-hamburger ${isOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>

          {/* Links */}
          <ul className={`guide-navbar-links ${isOpen ? "active" : ""}`}>
            <li>
              <a href="/guide/dashboard" onClick={handleNavClick}>
                Home
              </a>
            </li>
            <li>
              <a href="/guide/chat" onClick={handleNavClick}>
                Chat
              </a>
            </li>
            <li>
              <a href="/guide/guidelines" onClick={handleNavClick}>
                Guidelines
              </a>
            </li>

            <li className="guide-account-wrapper">
              <span className="guide-account-icon" onClick={toggleDropdown}>
                👤
              </span>

              {isDropdownOpen && (
                <div className="guide-dropdown">
                  <div className="guide-dropdown-email">{user?.email || 'user@example.com'}</div>
                  <button className="guide-logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default GuideNavbar;
