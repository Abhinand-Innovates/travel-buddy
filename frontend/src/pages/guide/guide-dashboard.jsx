import React from 'react';
import GuideNavbar from '../../components/guide-navbar';

const GuideDashboard = () => {
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .guide-dashboard-container {
          min-height: 100vh;
          background-color: #f5f5f5;
          padding: 40px 20px;
        }

        .guide-dashboard-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .guide-dashboard-header h1 {
          font-size: 36px;
          font-weight: 700;
          color: #4caf50;
          margin-bottom: 8px;
        }

        .guide-dashboard-header p {
          font-size: 16px;
          color: #888;
        }

        .guide-content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .guide-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .guide-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(76, 175, 80, 0.15);
        }

        .guide-card-icon {
          font-size: 40px;
          margin-bottom: 12px;
        }

        .guide-card h3 {
          font-size: 20px;
          color: #333;
          margin-bottom: 8px;
        }

        .guide-card p {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
        }

        .guide-button {
          display: inline-block;
          background-color: #4caf50;
          color: white;
          padding: 10px 24px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 16px;
        }

        .guide-button:hover {
          background-color: #45a049;
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
        }

        @media (max-width: 768px) {
          .guide-dashboard-container {
            padding: 20px 16px;
          }

          .guide-dashboard-header h1 {
            font-size: 28px;
          }

          .guide-content-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .guide-card {
            padding: 16px;
          }
        }
      `}</style>

      <GuideNavbar />

      <div className="guide-dashboard-container">
        <div className="guide-dashboard-header">
          <h1>Welcome to Your Guide Dashboard</h1>
          <p>Manage your services and connect with travelers</p>
        </div>

        <div className="guide-content-grid">
          <div className="guide-card">
            <div className="guide-card-icon">📋</div>
            <h3>My Services</h3>
            <p>Manage and showcase the travel services you offer to potential travelers.</p>
            <button className="guide-button">View Services</button>
          </div>

          <div className="guide-card">
            <div className="guide-card-icon">💬</div>
            <h3>Messages</h3>
            <p>Communicate with travelers interested in your services and answer queries.</p>
            <button className="guide-button">Check Messages</button>
          </div>

          <div className="guide-card">
            <div className="guide-card-icon">⭐</div>
            <h3>Ratings & Reviews</h3>
            <p>View feedback from travelers and improve your service quality.</p>
            <button className="guide-button">View Ratings</button>
          </div>

          <div className="guide-card">
            <div className="guide-card-icon">📊</div>
            <h3>Earnings</h3>
            <p>Track your earnings and view detailed financial reports.</p>
            <button className="guide-button">View Earnings</button>
          </div>

          <div className="guide-card">
            <div className="guide-card-icon">📅</div>
            <h3>Bookings</h3>
            <p>Manage your travel schedule and upcoming bookings.</p>
            <button className="guide-button">View Bookings</button>
          </div>

          <div className="guide-card">
            <div className="guide-card-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Update your profile information and preferences.</p>
            <button className="guide-button">Go to Settings</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuideDashboard;
