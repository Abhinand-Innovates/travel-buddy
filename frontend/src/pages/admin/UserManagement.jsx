import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  // Fetch all users from backend
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term (exclude deleted users)
  const filteredUsers = users.filter((user) => {
    if (user.isDeleted) return false; // Don't show deleted users
    return (
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile?.includes(searchTerm)
    );
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'name') {
      return a.fullName?.localeCompare(b.fullName);
    } else if (sortBy === 'email') {
      return a.email?.localeCompare(b.email);
    } else if (sortBy === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  const handleBlockUnblock = async (userId, currentBlocked) => {
    const action = currentBlocked ? 'unblock' : 'block';
    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User?`,
      text: `Are you sure you want to ${action} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: currentBlocked ? '#28a745' : '#ffc107',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/block`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      // Update local state
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, blocked: data.user.blocked } : user
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
    }
  };

  const handleSoftDelete = async (userId) => {
    const result = await Swal.fire({
      title: 'Delete User?',
      text: 'This action will soft delete the user. They will no longer appear in the system.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/soft-delete`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user');
      }

      // Update local state - remove from list
      setUsers(users.filter((user) => user._id !== userId));

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
    }
  };

  if (loading) {
    return (
      <div className="user-management">
        <div className="loading-spinner">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="management-header">
        <h1>User Management</h1>
        <p>Total Users: <span className="total-count">{users.length}</span></p>
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

      {sortedUsers.length === 0 ? (
        <div className="no-users">
          <p>No users found matching your criteria.</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Verified</th>
                <th>Blocked</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user._id} className={user.blocked ? 'blocked-row' : ''}>
                  <td>
                    <span className="user-name">
                      {user.fullName}
                      {user.isAdmin && <span className="admin-badge">ADMIN</span>}
                    </span>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>
                    <span className={`verified-badge ${user.isVerified ? 'yes' : 'no'}`}>
                      {user.isVerified ? '✓ Yes' : '✗ No'}
                    </span>
                  </td>
                  <td>
                    <span className={`blocked-badge ${user.blocked ? 'blocked' : 'active'}`}>
                      {user.blocked ? '🔒 Blocked' : '✓ Active'}
                    </span>
                  </td>
                  <td className="date-cell">
                    {new Date(user.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className={`btn ${user.blocked ? 'btn-success' : 'btn-warning'}`}
                        onClick={() => handleBlockUnblock(user._id, user.blocked)}
                        title={user.blocked ? 'Unblock User' : 'Block User'}
                      >
                        {user.blocked ? 'Unblock' : 'Block'}
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleSoftDelete(user._id)}
                        title="Delete User"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
