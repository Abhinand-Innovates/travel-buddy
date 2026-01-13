import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useFlashMessage } from '../../context/FlashMessageContext';

const GuideLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  const [kycLoading, setKycLoading] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showError, showSuccess } = useFlashMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use guide-specific login endpoint
      const res = await fetch('http://localhost:5000/api/guide/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const response = await res.json();

      if (!res.ok) {
        showError(response.message || 'Login failed');
        return;
      }

      login(response.user, response.token);
      showSuccess(response.message || 'Login successful!');
      navigate('/guide/dashboard');
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

  // Fetch KYC status when email changes
  useEffect(() => {
    const fetchKycStatus = async () => {
      if (email) {
        try {
          setKycLoading(true);
          const response = await fetch(`http://localhost:5000/api/guide/kyc-status/${encodeURIComponent(email)}`);
          const data = await response.json();

          if (response.ok) {
            setKycStatus(data);
          } else {
            setKycStatus(null);
          }
        } catch (error) {
          console.error('Failed to fetch KYC status:', error);
          setKycStatus(null);
        } finally {
          setKycLoading(false);
        }
      } else {
        setKycStatus(null);
        setKycLoading(false);
      }
    };

    fetchKycStatus();
  }, [email]);

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

        .password-field {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-field input {
          width: 100%;
          padding: 12px 16px;
          padding-right: 45px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .password-field input:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }

        .password-toggle-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          transition: color 0.3s ease;
        }

        .password-toggle-btn:hover {
          color: #4CAF50;
        }

        .password-toggle-btn:active {
          color: #45a049;
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

        .kyc-status-message {
          margin-bottom: 20px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }

        .kyc-status-message.pending {
          background-color: #ffebee;
          color: #c62828;
          border: 1px solid #ffcdd2;
        }

        .kyc-status-message.approved {
          background-color: #e8f5e8;
          color: #2e7d32;
          border: 1px solid #c8e6c9;
        }

        .kyc-status-message.rejected {
          background-color: #ffebee;
          color: #c62828;
          border: 1px solid #ffcdd2;
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Travel Buddy</h2>
          <p className="login-subtitle">Guide Sign in to your account</p>

          {/* KYC Status Message */}
          {email && !kycLoading && kycStatus && (
            <div className={`kyc-status-message ${kycStatus.status}`}>
              {kycStatus.status === 'pending' && (
                'Your KYC details have been submitted successfully and are under review. Please wait for admin approval. Verification may take up to 24 hours.'
              )}
              {kycStatus.status === 'approved' && (
                'Your KYC has been successfully verified and approved. You can now access all guide features.'
              )}
              {kycStatus.status === 'rejected' && (
                kycStatus.rejectionReason || 'Your application has been rejected by the admin.'
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
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
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="signup-text">
            Don't have an account? <a href="/guide/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default GuideLogin;
