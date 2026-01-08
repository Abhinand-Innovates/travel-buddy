import React, { useState } from 'react';

const CustomerSignup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup attempt:', { fullName, email, mobile, password, confirmPassword });
    // Add your signup logic here
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

        .signup-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
        }

        .signup-card {
          background-color: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .signup-title {
          font-size: 32px;
          font-weight: 700;
          color: #4CAF50;
          margin-bottom: 8px;
        }

        .signup-subtitle {
          color: #666;
          margin-bottom: 30px;
          font-size: 15px;
        }

        .signup-form {
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

        .signup-button {
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

        .signup-button:hover {
          background-color: #45a049;
        }

        .login-text {
          margin-top: 30px;
          color: #666;
          font-size: 14px;
        }

        .login-text a {
          color: #4CAF50;
          text-decoration: none;
          font-weight: 500;
        }

        .login-text a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Traval Buddy</h2>
          <p className="signup-subtitle">Create your account</p>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="input-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter your mobile number"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>

          <p className="login-text">
            Already have an account? <a href="/CustomerLogin">Sign In</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default CustomerSignup;