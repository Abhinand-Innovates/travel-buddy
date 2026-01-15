import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logoutUser();
    logout();
    setIsDropdownOpen(false);
    setIsOpen(false);
    navigate("/traveller/login");
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <style>{`
        .navbar {
          width: 100%;
          height: 70px;
          background-color: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        .navbar-container {
          max-width: 1200px;
          height: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-logo {
          font-size: 1.6rem;
          font-weight: 700;
          color: #16a34a;
          text-decoration: none;
          cursor: pointer;
        }

        .navbar-logo:hover {
          color: #15803d;
        }

        .navbar-links {
          display: flex;
          list-style: none;
          gap: 32px;
          align-items: center;
        }

        .navbar-links a {
          text-decoration: none;
          color: #1f2937;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .navbar-links a:hover {
          color: #16a34a;
        }

        .account-wrapper {
          position: relative;
        }

        .account-icon {
          font-size: 1.5rem;
          cursor: pointer;
          user-select: none;
          transition: transform 0.2s ease;
        }

        .account-icon:hover {
          transform: scale(1.1);
        }

        .dropdown {
          position: absolute;
          right: 0;
          top: 45px;
          width: 180px;
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 6px 15px rgba(0,0,0,0.1);
          border-radius: 8px;
          overflow: hidden;
          z-index: 2000;
        }

        .dropdown-user-info {
          padding: 10px 12px;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          cursor: default;
        }

        .dropdown-user-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: #1f2937;
          margin-bottom: 2px;
        }

        .dropdown-user-email {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .dropdown a,
        .dropdown button {
          display: block;
          width: 100%;
          padding: 10px 12px;
          text-align: left;
          background: none;
          border: none;
          font-size: 0.85rem;
          cursor: pointer;
          color: #1f2937;
          text-decoration: none;
          border-bottom: 1px solid #e5e7eb;
        }

        .dropdown a:hover,
        .dropdown button:hover {
          background-color: #f3f4f6;
        }

        .logout-btn {
          color: #dc2626;
          font-weight: 500;
          border-bottom: none !important;
        }

        .logout-btn:hover {
          background-color: #fee2e2 !important;
        }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
        }

        .hamburger span {
          width: 25px;
          height: 3px;
          background-color: #333;
          margin: 4px 0;
          transition: 0.3s;
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(10px, 10px);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -7px);
        }

        @media (max-width: 768px) {
          .hamburger {
            display: flex;
          }

          .navbar-links {
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

          .navbar-links.active {
            max-height: 400px;
            padding: 20px 0;
          }

          .navbar-links a,
          .navbar-links li {
            padding: 12px 24px;
            border-bottom: 1px solid #f3f4f6;
          }

          .navbar-links li {
            padding: 0;
          }

          .account-wrapper {
            width: 100%;
          }

          .account-wrapper > a {
            display: block;
            padding: 12px 24px;
            border-bottom: 1px solid #f3f4f6;
          }

          .dropdown {
            position: static;
            width: 100%;
            box-shadow: none;
            border: none;
            border-top: 1px solid #f3f4f6;
            border-radius: 0;
          }

          .dropdown a,
          .dropdown button,
          .dropdown div {
            padding: 12px 24px;
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <a href="/" className="navbar-logo">
            Travel Buddy
          </a>

          {/* Hamburger */}
          <button
            className={`hamburger ${isOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>

          {/* Links */}
          <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
            <li>
              <a href="/" onClick={handleNavClick}>
                Home
              </a>
            </li>
            <li>
              <a href="#about" onClick={handleNavClick}>
                About
              </a>
            </li>
            <li>
              <a href="#contact" onClick={handleNavClick}>
                Contact
              </a>
            </li>

            {!isAuthenticated ? (
              <>
                <li>
                  <a href="/traveller/login" onClick={handleNavClick}>
                    Login
                  </a>
                </li>
                <li>
                  <a href="/traveller/signup" onClick={handleNavClick}>
                    Signup
                  </a>
                </li>
              </>
            ) : (
              <li className="account-wrapper">
                <span className="account-icon" onClick={toggleDropdown}>
                  👤
                </span>

                {isDropdownOpen && (
                  <div className="dropdown">
                    <div className="dropdown-user-info">
                      <div className="dropdown-user-name">{user?.fullName || "User"}</div>
                      <div className="dropdown-user-email">{user?.email}</div>
                    </div>
                    <a href="/account">My Account</a>
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
