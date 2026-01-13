import { getToken, removeToken } from '../services/authService';

export const apiClient = async (url, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (response.status === 403 && (data.accountStatus === 'blocked' || data.accountStatus === 'deleted')) {
    removeToken();
    window.location.href = `/traveller-login?message=${encodeURIComponent(data.message)}`;
    throw new Error(data.message);
  }

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};
