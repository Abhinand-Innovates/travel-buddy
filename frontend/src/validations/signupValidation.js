export const validateSignup = ({
  fullName,
  email,
  mobile,
  password,
  confirmPassword,
}) => {
  if (!fullName || !email || !mobile || !password || !confirmPassword) {
    return 'All fields are required';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email address';
  }

  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobile)) {
    return 'Mobile number must be 10 digits';
  }

  return null; 
};
