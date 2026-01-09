import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Simulated auth state (replace with real session later)
  const [user, setUser] = useState(null);
  // Example logged-in user:
  // const [user, setUser] = useState({ email: "user@example.com" });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    setUser(null);
    setIsDropdownOpen(false);
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
        }

        .account-wrapper {
          position: relative;
        }

        .account-icon {
          font-size: 1.5rem;
          cursor: pointer;
          user-select: none;
        }

        .dropdown {
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

        .dropdown a,
        .dropdown button,
        .dropdown div {
          display: block;
          width: 100%;
          padding: 12px 16px;
          text-align: left;
          background: none;
          border: none;
          font-size: 0.95rem;
          cursor: pointer;
          color: #1f2937;
        }

        .dropdown a:hover,
        .dropdown button:hover {
          background-color: #f3f4f6;
        }

        .dropdown-email {
          font-weight: 600;
          cursor: default;
          background-color: #f9fafb;
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
          }

          .navbar-links.active {
            max-height: 300px;
            padding: 20px 0;
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <a href="/traveller/dashboard" className="navbar-logo">
            Traval Buddy
          </a>

          {/* Hamburger */}
          <button className="hamburger" onClick={toggleMenu}>
            <span />
            <span />
            <span />
          </button>

          {/* Links */}
          <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
            <li>
              <a href="/traveller/dashboard" onClick={() => setIsOpen(false)}>
                Home
              </a>
            </li>

            {/* Account Icon */}
            <li className="account-wrapper">
              <span className="account-icon" onClick={toggleDropdown}>
                👤
              </span>

              {isDropdownOpen && (
                <div className="dropdown">
                  {!user ? (
                    <>
                      <a href="/traveller/login">Login</a>
                      <a href="/traveller/signup">Signup</a>
                    </>
                  ) : (
                    <>
                      <div className="dropdown-email">{user.email}</div>
                      <button onClick={handleLogout}>Logout</button>
                    </>
                  )}
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
