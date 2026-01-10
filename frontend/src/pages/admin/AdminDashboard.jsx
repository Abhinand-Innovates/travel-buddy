import React from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the Travel Buddy Admin Panel</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon users">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">--</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon guides">🧭</div>
          <div className="stat-content">
            <h3>Total Guides</h3>
            <p className="stat-number">--</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bookings">📅</div>
          <div className="stat-content">
            <h3>Total Bookings</h3>
            <p className="stat-number">--</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon reviews">⭐</div>
          <div className="stat-content">
            <h3>Total Reviews</h3>
            <p className="stat-number">--</p>
          </div>
        </div>
      </div>

      <div className="dashboard-welcome">
        <h2>Getting Started</h2>
        <p>
          Use the sidebar to navigate through different sections of the admin
          panel. Manage users, guides, KYC information, and more.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
