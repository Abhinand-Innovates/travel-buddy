import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './GuideManagement.css';

const KycManagement = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);

  useEffect(() => {
    fetchPendingGuides();
  }, []);

  const fetchPendingGuides = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5000/api/guide/pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setGuides(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch guides:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch KYC requests',
        icon: 'error',
        confirmButtonColor: '#dc3545',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: 'Approve KYC?',
      text: 'Are you sure you want to approve this KYC application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:5000/api/guide/approve/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to approve guide');
      }

      setGuides(guides.filter(guide => guide._id !== id));
      setSelectedGuide(null);

      Swal.fire({
        title: 'Success!',
        text: 'Guide approved successfully',
        icon: 'success',
        confirmButtonColor: '#28a745',
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.message,
        icon: 'error',
        confirmButtonColor: '#dc3545',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason.trim()) {
      Swal.fire({
        title: 'Error!',
        text: 'Please provide a reason for rejection',
        icon: 'error',
        confirmButtonColor: '#dc3545',
      });
      return;
    }

    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:5000/api/guide/reject/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reject guide');
      }

      setGuides(guides.filter(guide => guide._id !== id));
      setSelectedGuide(null);
      setShowRejectModal(false);
      setRejectionReason('');

      Swal.fire({
        title: 'Success!',
        text: 'Guide rejected successfully',
        icon: 'success',
        confirmButtonColor: '#28a745',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to reject guide',
        icon: 'error',
        confirmButtonColor: '#dc3545',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (guide) => {
    setSelectedGuide(guide);
    setShowRejectModal(true);
  };

  if (loading) {
    return (
      <div className="guide-management">
        <div className="loading-spinner">Loading KYC requests...</div>
      </div>
    );
  }

  return (
    <div className="guide-management">
      <div className="management-header">
        <h1>KYC Management</h1>
        <p>Pending KYC Requests: <span className="total-count">{guides.length}</span></p>
      </div>

      {guides.length === 0 ? (
        <div className="no-guides">
          <p>No pending KYC requests</p>
        </div>
      ) : (
        <div className="guides-table-container">
          <table className="guides-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Address</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guides.map((guide) => (
                <tr key={guide._id} className={`${guide.status}-row`}>
                  <td>
                    <span className="guide-name">
                      {guide.fullName}
                      <span className={`status-badge ${guide.status}`}>{guide.status.toUpperCase()}</span>
                    </span>
                  </td>
                  <td>{guide.email}</td>
                  <td>{guide.mobile}</td>
                  <td className="address-cell">{guide.fullAddress}</td>
                  <td>
                    <span className={`status-badge ${guide.status}`}>
                      {guide.status === 'pending' && '⏳ Pending'}
                    </span>
                  </td>
                  <td className="date-cell">
                    {new Date(guide.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-view"
                        onClick={() => setSelectedGuide(guide)}
                        title="View Details"
                        disabled={actionLoading}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => handleApprove(guide._id)}
                        title="Approve KYC"
                        disabled={actionLoading}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => openRejectModal(guide)}
                        title="Reject KYC"
                        disabled={actionLoading}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  onClick={() => setExpandedImage(`http://localhost:5000${selectedGuide.selfieUrl.startsWith('/') ? selectedGuide.selfieUrl : '/' + selectedGuide.selfieUrl}`)}
                  style={{ cursor: 'pointer' }}
                />
              </div>

              <div className="detail-section">
                <h4>Aadhaar Front</h4>
                <img
                  src={`http://localhost:5000${selectedGuide.aadhaarFrontUrl.startsWith('/') ? selectedGuide.aadhaarFrontUrl : '/' + selectedGuide.aadhaarFrontUrl}`}
                  alt="Aadhaar Front"
                  className="document-image"
                  onClick={() => setExpandedImage(`http://localhost:5000${selectedGuide.aadhaarFrontUrl.startsWith('/') ? selectedGuide.aadhaarFrontUrl : '/' + selectedGuide.aadhaarFrontUrl}`)}
                  style={{ cursor: 'pointer' }}
                />
              </div>

              <div className="detail-section">
                <h4>Aadhaar Back</h4>
                <img
                  src={`http://localhost:5000${selectedGuide.aadhaarBackUrl.startsWith('/') ? selectedGuide.aadhaarBackUrl : '/' + selectedGuide.aadhaarBackUrl}`}
                  alt="Aadhaar Back"
                  className="document-image"
                  onClick={() => setExpandedImage(`http://localhost:5000${selectedGuide.aadhaarBackUrl.startsWith('/') ? selectedGuide.aadhaarBackUrl : '/' + selectedGuide.aadhaarBackUrl}`)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => handleApprove(selectedGuide._id)}
                className="btn btn-success"
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => openRejectModal(selectedGuide)}
                className="btn btn-danger"
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Reject'}
              </button>
              <button
                onClick={() => setSelectedGuide(null)}
                className="btn btn-close"
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
                rows="6"
                className="reason-textarea"
              />
            </div>

            <div className="modal-actions">
              <button
                onClick={() => handleReject(selectedGuide._id)}
                className="btn btn-danger"
                disabled={actionLoading || !rejectionReason.trim()}
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedGuide(null);
                }}
                className="btn btn-close"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {expandedImage && (
        <div className="modal-overlay" onClick={() => setExpandedImage(null)}>
          <div className="image-viewer-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-image-btn"
              onClick={() => setExpandedImage(null)}
              title="Close"
            >
              ✕
            </button>
            <img src={expandedImage} alt="Expanded view" className="expanded-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default KycManagement;
