import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useFlashMessage } from '../../context/FlashMessageContext';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showError, showSuccess } = useFlashMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      login(response.user, response.token);
      showSuccess(response.message || 'Login successful!');
      navigate('/traveller/dashboard');
    } catch (error) {
      showError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign In clicked');
    // Add Google auth logic here
  };

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
          padding: 20px;
          margin-top: 20px;
        }

        .login-card {
          background-color: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .login-title {
          font-size: 32px;
          font-weight: 700;
          color: #4CAF50;
          margin-bottom: 8px;
        }

        .login-subtitle {
          color: #666;
          margin-bottom: 30px;
          font-size: 15px;
        }

        .login-form {
          text-align: left;
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #444;
          font-size: 14px;
        }

        .input-group input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .input-group input:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }

        .forgot-link {
          display: block;
          text-align: right;
          margin-top: 8px;
          color: #4CAF50;
          font-size: 14px;
          text-decoration: none;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          padding: 14px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .login-button:hover {
          background-color: #45a049;
        }

        .login-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .divider {
          margin: 30px 0;
          position: relative;
          text-align: center;
          color: #aaa;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background-color: #ddd;
        }

        .divider span {
          background-color: white;
          padding: 0 20px;
        }

        .google-button {
          width: 100%;
          padding: 12px;
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .google-button:hover {
          background-color: #f9f9f9;
        }

        .signup-text {
          margin-top: 30px;
          color: #666;
          font-size: 14px;
        }

        .signup-text a {
          color: #4CAF50;
          text-decoration: none;
          font-weight: 500;
        }

        .signup-text a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Travel Buddy</h2>
          <p className="login-subtitle">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <button onClick={handleGoogleSignIn} className="google-button" disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2045C17.64 8.5664 17.5827 7.9527 17.4764 7.3636H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.2045Z" fill="#4285F4"/>
              <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.6555 14.4205 4.6718 12.8373 3.9641 10.71H0.9573V13.0418C2.4382 15.9832 5.4818 18 9 18Z" fill="#34A853"/>
              <path d="M3.9641 10.71C3.7841 10.17 3.6827 9.595 3.6827 9C3.6827 8.405 3.7841 7.83 3.9641 7.29V4.9582H0.9573C0.3477 6.1732 0 7.5477 0 9C0 10.4523 0.3477 11.8268 0.9573 13.0418L3.9641 10.71Z" fill="#FBBC05"/>
              <path d="M9 3.5795C10.3214 3.5795 11.5077 4.0336 12.4405 4.9259L15.0218 2.3445C13.4632 0.8918 11.4259 0 9 0C5.4818 0 2.4382 2.0168 0.9573 4.9582L3.9641 7.29C4.6718 5.1627 6.6555 3.5795 9 3.5795Z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <p className="signup-text">
            Don't have an account? <a href="/traveller/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default CustomerLogin;