const API_BASE_URL = 'http://localhost:5000/api/auth';

export const signupUser = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Signup failed');
  }

  return response.json();
};
