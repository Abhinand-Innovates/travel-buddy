import React, { useState, useEffect } from 'react';
import './GuideManagement.css';

const KycManagement = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchPendingGuides();
  }, []);

  const fetchPendingGuides = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5000/api/guide/pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setGuides(data);
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
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:5000/api/guide/reject/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (res.ok) {
        setGuides(guides.filter(guide => guide._id !== id));
        setSelectedGuide(null);
        setShowRejectModal(false);
        setRejectionReason('');
        alert('Guide rejected successfully');
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

  const openRejectModal = (guide) => {
    setSelectedGuide(guide);
    setShowRejectModal(true);
  };

  if (loading) {
    return <div className="loading">Loading KYC requests...</div>;
  }

  return (
    <div className="guide-management">
      <h2>KYC Management</h2>

      {guides.length === 0 ? (
        <div className="no-guides">No pending KYC requests</div>
      ) : (
        <div className="guides-list">
          {guides.map((guide) => (
            <div key={guide._id} className="guide-card">
              <div className="guide-info">
                <h3>{guide.fullName}</h3>
                <p>Email: {guide.email}</p>
                <p>Phone: {guide.mobile}</p>
                <p>Address: {guide.fullAddress}</p>
                <p>Status: {guide.status}</p>
                <p>Created: {new Date(guide.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="guide-actions">
                <button
                  onClick={() => setSelectedGuide(guide)}
                  className="view-btn"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleApprove(guide._id)}
                  className="approve-btn"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={() => openRejectModal(guide)}
                  className="reject-btn"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedGuide && !showRejectModal && (
        <div className="modal-overlay" onClick={() => setSelectedGuide(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>KYC Details</h3>
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
                  src={`http://localhost:5000${selectedGuide.selfieUrl.startsWith('/') ? selectedGuide.selfieUrl : '/' + selectedGuide.selfieUrl}`}
                  alt="Selfie"
                  className="document-image"
                />
              </div>

              <div className="detail-section">
                <h4>Aadhaar Front</h4>
                <img
                  src={`http://localhost:5000${selectedGuide.aadhaarFrontUrl.startsWith('/') ? selectedGuide.aadhaarFrontUrl : '/' + selectedGuide.aadhaarFrontUrl}`}
                  alt="Aadhaar Front"
                  className="document-image"
                />
              </div>

              <div className="detail-section">
                <h4>Aadhaar Back</h4>
                <img
                  src={`http://localhost:5000${selectedGuide.aadhaarBackUrl.startsWith('/') ? selectedGuide.aadhaarBackUrl : '/' + selectedGuide.aadhaarBackUrl}`}
                  alt="Aadhaar Back"
                  className="document-image"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => handleApprove(selectedGuide._id)}
                className="approve-btn"
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => openRejectModal(selectedGuide)}
                className="reject-btn"
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Reject'}
              </button>
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

      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Reject KYC Application</h3>
            <div className="reject-form">
              <p>Provide a reason for rejection:</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows="4"
                className="reason-textarea"
              />
            </div>

            <div className="modal-actions">
              <button
                onClick={() => handleReject(selectedGuide._id)}
                className="reject-btn"
                disabled={actionLoading || !rejectionReason.trim()}
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="close-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KycManagement;
