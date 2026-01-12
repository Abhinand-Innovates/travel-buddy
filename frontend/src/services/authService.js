const API_BASE_URL = 'http://localhost:5000/api/auth';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Token Management - Using sessionStorage (isolated per tab)
export const setToken = (token) => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const setUserData = (userData) => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
};

export const getUserData = () => {
  const data = sessionStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

// Auth APIs
export const signupUser = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }

  return data;
};

export const verifyOtpUser = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'OTP verification failed');
  }

  return data;
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  // Store token and user data
  if (data.token) {
    setToken(data.token);
  }
  if (data.user) {
    setUserData(data.user);
  }

  return data;
};

export const logoutUser = () => {
  removeToken();
};
