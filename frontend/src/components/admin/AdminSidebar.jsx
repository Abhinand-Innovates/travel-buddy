import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'User Management', path: '/admin/users', icon: '👥' },
    { label: 'Guide Management', path: '/admin/guides', icon: '🧭' },
    { label: 'KYC Management', path: '/admin/kyc', icon: '📋' },
    { label: 'Communication', path: '/admin/communication', icon: '💬' },
    { label: 'Reviews Management', path: '/admin/reviews', icon: '⭐' },
    { label: 'Web Management', path: '/admin/web', icon: '🌐' },
    { label: 'Report Management', path: '/admin/reports', icon: '📑' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2 className={`sidebar-title ${!isOpen && 'hidden'}`}>Admin Panel</h2>
        <button
          className="toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? 'Close' : 'Open'}
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                title={item.label}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className={`menu-label ${!isOpen && 'hidden'}`}>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          <span className="menu-icon">🚪</span>
          <span className={`menu-label ${!isOpen && 'hidden'}`}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
