import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateSignup } from '../../validations/signupValidation';
import { signupUser } from '../../services/authService';
import { useFlashMessage } from '../../context/FlashMessageContext';
import './traveller-signup.css';

const CustomerSignup = () => {
  const navigate = useNavigate();
  const { showError } = useFlashMessage();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateSignup(formData);
    if (error) {
      showError(error);
      return;
    }

    try {
      setLoading(true);

      await signupUser({
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      });

      navigate('/verify-otp', { state: { email: formData.email } });

    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* styles unchanged */}

      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Traval Buddy</h2>
          <p className="signup-subtitle">Create your account</p>

          <form onSubmit={handleSubmit} className="signup-form">
            {[
              { id: 'fullName', label: 'Full Name', type: 'text' },
              { id: 'email', label: 'Email', type: 'email' },
              { id: 'mobile', label: 'Mobile Number', type: 'tel' },
              { id: 'password', label: 'Password', type: 'password' },
              { id: 'confirmPassword', label: 'Confirm Password', type: 'password' },
            ].map((field) => (
              <div className="input-group" key={field.id}>
                <label htmlFor={field.id}>{field.label}</label>
                <input
                  id={field.id}
                  type={field.type}
                  value={formData[field.id]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Sign Up'}
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
