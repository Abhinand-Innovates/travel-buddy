import React, { useState, useEffect } from "react";
import SearchBar from "../../components/serachBar";
import LoginRequiredModal from "../../components/loginRequiredModal";
import { apiClient } from "../../utils/apiClient";

const CustomerDashboard = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await apiClient('http://localhost:5000/api/user/profile');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      fetchUserData();
    }
  }, []);

  const handlePlaceSelect = (place) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowLoginModal(true);
      return;
    }

    // Logged in (next step: API call / redirect)
    console.log("Proceed with search for:", place);
  };

  return (
    <>
      {/* Dashboard Styles */}
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

        .dashboard-container {
          min-height: 100vh;
          background-color: #f5f5f5;
          padding: 40px 20px;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .dashboard-header h1 {
          font-size: 36px;
          font-weight: 700;
          color: #4caf50;
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
          margin-top: 40px;
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
          color: #4caf50;
          margin: 0;
        }
      `}</style>

      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <h1>Make Journies Memorable</h1>
          <p>Find verified local guides for your next Trip!!</p>
        </header>

        {/* Search Bar */}
        <SearchBar onPlaceSelect={handlePlaceSelect} />

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Trips Completed</h3>
            <p className="stat-number">24</p>
          </div>

          <div className="stat-card">
            <h3>Countries Visited</h3>
            <p className="stat-number">12</p>
          </div>

          <div className="stat-card">
            <h3>Verified Guides</h3>
            <p className="stat-number">180+</p>
          </div>
        </div>
      </div>

      {/* Login Required Modal */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default CustomerDashboard;
