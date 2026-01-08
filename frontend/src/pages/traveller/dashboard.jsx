import React from 'react';

const CustomerDashboard = () => {
  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .dashboard-container {
          min-height: 100vh;
          background-color: #f5f5f5;
          padding: 40px 20px;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .dashboard-header h1 {
          font-size: 36px;
          font-weight: 700;
          color: #4CAF50;
          margin-bottom: 8px;
        }

        .dashboard-header p {
          color: #666;
          font-size: 18px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 50px;
        }

        .stat-card {
          background-color: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        .stat-card h3 {
          color: #555;
          font-size: 16px;
          margin-bottom: 12px;
        }

        .stat-number {
          font-size: 42px;
          font-weight: 700;
          color: #4CAF50;
          margin: 0;
        }

        .stat-change {
          display: block;
          margin-top: 12px;
          font-size: 14px;
          color: #777;
        }

        .stat-change.positive {
          color: #4CAF50;
        }

        .section {
          margin-bottom: 50px;
        }

        .section h2 {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
        }

        .trips-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .trip-item {
          background-color: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .trip-info h4 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }

        .trip-info p {
          margin: 8px 0 0;
          color: #666;
          font-size: 14px;
        }

        .trip-status {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .trip-status.confirmed {
          background-color: #e8f5e9;
          color: #4CAF50;
        }

        .trip-status.pending {
          background-color: #fff3e0;
          color: #ff9800;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .action-button {
          padding: 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .action-button:hover {
          background-color: #45a049;
        }

        @media (max-width: 768px) {
          .dashboard-header h1 {
            font-size: 30px;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .trip-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .trip-status {
            align-self: flex-end;
            margin-top: 12px;
          }
        }

        @media (max-width: 480px) {
          .dashboard-container {
            padding: 20px 15px;
          }

          .dashboard-header h1 {
            font-size: 28px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <h1>Traval Buddy</h1>
          <p>Welcome back! Ready for your next adventure? ✈️</p>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Trips</h3>
            <p className="stat-number">24</p>
            <span className="stat-change positive">+3 this year</span>
          </div>
          <div className="stat-card">
            <h3>Countries Visited</h3>
            <p className="stat-number">12</p>
            <span className="stat-change positive">+2 new</span>
          </div>
          <div className="stat-card">
            <h3>Miles Traveled</h3>
            <p className="stat-number">48,520</p>
            <span className="stat-change">Air & Land</span>
          </div>
          <div className="stat-card">
            <h3>Upcoming Bookings</h3>
            <p className="stat-number">3</p>
            <span className="stat-change">Next trip in 12 days</span>
          </div>
        </div>

        {/* Upcoming Trips */}
        <section className="section">
          <h2>Upcoming Trips</h2>
          <div className="trips-list">
            <div className="trip-item">
              <div className="trip-info">
                <h4>Bali, Indonesia</h4>
                <p>Jan 19 – Jan 26, 2026</p>
              </div>
              <span className="trip-status confirmed">Confirmed</span>
            </div>
            <div className="trip-item">
              <div className="trip-info">
                <h4>Tokyo, Japan</h4>
                <p>Mar 05 – Mar 12, 2026</p>
              </div>
              <span className="trip-status pending">Pending Payment</span>
            </div>
            <div className="trip-item">
              <div className="trip-info">
                <h4>Santorini, Greece</h4>
                <p>Jun 14 – Jun 21, 2026</p>
              </div>
              <span className="trip-status confirmed">Confirmed</span>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-button">Plan New Trip</button>
            <button className="action-button">View Past Trips</button>
            <button className="action-button">Manage Bookings</button>
            <button className="action-button">Travel Checklist</button>
          </div>
        </section>
      </div>
    </>
  );
};

export default CustomerDashboard;