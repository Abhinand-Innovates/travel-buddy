import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFlashMessage } from '../../context/FlashMessageContext';
import './varify-otp.css';

const VarifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { showWarning } = useFlashMessage();

  const email = state?.email;

  // Redirect if accessed directly
  useEffect(() => {
    if (!email) {
      navigate('/customerSignup');
      return;
    }
    inputRefs.current[0]?.focus();
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 🔐 VERIFY OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      showWarning('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpValue,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showWarning(data.message || 'OTP verification failed');
        return;
      }

      // ✅ SUCCESS
      navigate('/customerLogin');

    } catch (error) {
      showWarning('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 🔁 RESEND OTP
  const handleResendOtp = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        showWarning(data.message || 'Failed to resend OTP');
        return;
      }

      showWarning('OTP resent successfully');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();

    } catch (error) {
      showWarning('Failed to resend OTP');
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2 className="otp-title">Traval Buddy</h2>

        <p className="otp-subtitle">
          We've sent a 6-digit verification code to <b>{email}</b>.<br />
          OTP will expire within 1 minute.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="otp-input"
              />
            ))}
          </div>

          <button
            type="submit"
            className="otp-button"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <p className="resend-text">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={handleResendOtp}
            className="resend-link"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default VarifyOtp;
