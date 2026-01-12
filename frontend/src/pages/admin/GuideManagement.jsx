import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './GuideManagement.css';

const GuideManagement = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAllGuides();
  }, []);

  const fetchAllGuides = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5000/api/guide/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch guides');
      }

      setGuides(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setGuides([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter guides based on search term
  const filteredGuides = guides.filter((guide) => {
    if (guide.isDeleted) return false; // Don't show deleted guides
    return (
      guide.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.mobile?.includes(searchTerm)
    );
  });

  // Sort guides
  const sortedGuides = [...filteredGuides].sort((a, b) => {
    if (sortBy === 'name') {
      return a.fullName?.localeCompare(b.fullName);
    } else if (sortBy === 'email') {
      return a.email?.localeCompare(b.email);
    } else if (sortBy === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: 'Approve Guide?',
      text: 'Are you sure you want to approve this guide?',
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

      setGuides(guides.map(guide => 
        guide._id === id ? { ...guide, status: 'approved' } : guide
      ));
      setSelectedGuide(null);

      Swal.fire({
        title: 'Success!',
        text: data.message,
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
    const result = await Swal.fire({
      title: 'Reject Guide?',
      text: 'This action will permanently delete all uploaded files.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:5000/api/guide/reject/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reject guide');
      }

      setGuides(guides.map(guide => 
        guide._id === id ? { ...guide, status: 'rejected' } : guide
      ));
      setSelectedGuide(null);

      Swal.fire({
        title: 'Success!',
        text: data.message,
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

  const handleViewDetails = (guide) => {
    setSelectedGuide(guide);
  };

  const handleBlockUnblock = async (guideId, currentBlocked) => {
    const action = currentBlocked ? 'unblock' : 'block';
    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Guide?`,
      text: `Are you sure you want to ${action} this guide?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: currentBlocked ? '#28a745' : '#ffc107',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:5000/api/guide/${guideId}/block`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update guide');
      }

      // Update local state
      setGuides(
        guides.map((guide) =>
          guide._id === guideId ? { ...guide, blocked: data.guide.blocked } : guide
        )
      );

      Swal.fire({
        title: 'Success!',
        text: data.message,
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

  const handleSoftDelete = async (guideId) => {
    const result = await Swal.fire({
      title: 'Delete Guide?',
      text: 'This action will soft delete the guide. They will no longer appear in the system.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:5000/api/guide/${guideId}/soft-delete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete guide');
      }

      // Update local state - remove from list
      setGuides(guides.filter((guide) => guide._id !== guideId));
      setSelectedGuide(null);

      Swal.fire({
        title: 'Deleted!',
        text: data.message,
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

  if (loading) {
    return (
      <div className="guide-management">
        <div className="loading-spinner">Loading guides...</div>
      </div>
    );
  }

  return (
    <div className="guide-management">
      <div className="management-header">
        <h1>Guide Management</h1>
        <p>Total Guides: <span className="total-count">{guides.length}</span></p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="management-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="sort-box">
          <label htmlFor="sortBy">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="createdAt">Newest First</option>
            <option value="name">Name (A-Z)</option>
            <option value="email">Email (A-Z)</option>
          </select>
        </div>
      </div>

      {sortedGuides.length === 0 ? (
        <div className="no-guides">
          <p>No guides found matching your criteria.</p>
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
                <th>Blocked</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedGuides.map((guide) => (
                <tr key={guide._id} className={`${guide.blocked ? 'blocked-row' : ''} ${guide.status}-row`}>
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
                      {guide.status === 'approved' && '✓ Approved'}
                      {guide.status === 'rejected' && '✗ Rejected'}
                    </span>
                  </td>
                  <td>
                    <span className={`blocked-badge ${guide.blocked ? 'blocked' : 'active'}`}>
                      {guide.blocked ? '🔒 Blocked' : '✓ Active'}
                    </span>
                  </td>
                  <td className="date-cell">
                    {new Date(guide.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-view"
                        onClick={() => handleViewDetails(guide)}
                        title="View Details"
                        disabled={actionLoading}
                      >
                        View
                      </button>
                      {guide.status === 'pending' && (
                        <>
                          <button
                            className="btn btn-success"
                            onClick={() => handleApprove(guide._id)}
                            title="Approve Guide"
                            disabled={actionLoading}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleReject(guide._id)}
                            title="Reject Guide"
                            disabled={actionLoading}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {guide.status === 'approved' && (
                        <>
                          <button
                            className={`btn ${guide.blocked ? 'btn-success' : 'btn-warning'}`}
                            onClick={() => handleBlockUnblock(guide._id, guide.blocked)}
                            title={guide.blocked ? 'Unblock Guide' : 'Block Guide'}
                            disabled={actionLoading}
                          >
                            {guide.blocked ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => handleSoftDelete(guide._id)}
                            title="Delete Guide"
                            disabled={actionLoading}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <p><strong>Status:</strong> <span className={`status-badge ${selectedGuide.status}`}>{selectedGuide.status.toUpperCase()}</span></p>
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
              {selectedGuide.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(selectedGuide._id)}
                    className="btn btn-success"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(selectedGuide._id)}
                    className="btn btn-danger"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Processing...' : 'Reject'}
                  </button>
                </>
              )}
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
    </div>
  );
};

export default GuideManagement;
