import React, { useState, useEffect } from 'react';
import './GuideManagement.css';

const GuideManagement = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApprovedGuides();
  }, []);

  const fetchApprovedGuides = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5000/api/guide/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        // Filter only approved guides
        const approvedGuides = data.filter(guide => guide.status === 'approved');
        setGuides(approvedGuides);
      }
    } catch (error) {
      console.error('Failed to fetch guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:5000/api/guide/approve/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setGuides(guides.filter(guide => guide._id !== id));
        setSelectedGuide(null);
        alert('Guide approved successfully');
      } else {
        alert('Failed to approve guide');
      }
    } catch (error) {
      console.error('Failed to approve guide:', error);
      alert('Failed to approve guide');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to reject this guide? This will permanently delete all uploaded files.')) {
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:5000/api/guide/reject/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setGuides(guides.filter(guide => guide._id !== id));
        setSelectedGuide(null);
        alert('Guide rejected and files deleted');
      } else {
        alert('Failed to reject guide');
      }
    } catch (error) {
      console.error('Failed to reject guide:', error);
      alert('Failed to reject guide');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading guides...</div>;
  }

  return (
    <div className="guide-management">
      <h2>Approved Guides</h2>

      {guides.length === 0 ? (
        <div className="no-guides">No approved guides found</div>
      ) : (
        <div className="guides-list">
          {guides.map((guide) => (
            <div key={guide._id} className="guide-card">
              <div className="guide-info">
                <h3>{guide.fullName}</h3>
                <p>Email: {guide.email}</p>
                <p>Phone: {guide.mobile}</p>
                <p>Address: {guide.fullAddress}</p>
                <p>Approved: {new Date(guide.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="guide-actions">
                <button
                  onClick={() => setSelectedGuide(guide)}
                  className="view-btn"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedGuide && (
        <div className="modal-overlay" onClick={() => setSelectedGuide(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Guide Details</h3>
            <div className="guide-details">
              <div className="detail-section">
                <h4>Personal Information</h4>
                <p><strong>Name:</strong> {selectedGuide.fullName}</p>
                <p><strong>Email:</strong> {selectedGuide.email}</p>
                <p><strong>Phone:</strong> {selectedGuide.mobile}</p>
                <p><strong>Address:</strong> {selectedGuide.fullAddress}</p>
              </div>

              <div className="detail-section">
                <h4>Selfie</h4>
                <img
                  src={`http://localhost:5000${selectedGuide.selfieUrl}`}
                  alt="Selfie"
                  className="document-image"
                />
              </div>

              <div className="detail-section">
                <h4>Aadhaar Front</h4>
                <img
                  src={`http://localhost:5000${selectedGuide.aadhaarFrontUrl}`}
                  alt="Aadhaar Front"
                  className="document-image"
                />
              </div>

              <div className="detail-section">
                <h4>Aadhaar Back</h4>
                <img
                  src={`http://localhost:5000${selectedGuide.aadhaarBackUrl}`}
                  alt="Aadhaar Back"
                  className="document-image"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setSelectedGuide(null)}
                className="close-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideManagement;
