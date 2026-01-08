import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './varify-otp.css';

const VarifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { state } = useLocation();

  const email = state?.email; // passed from signup

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    console.log('Verify OTP:', { email, otpCode });

    // 🔜 Next step: call backend verify-otp API
    // navigate('/login') on success
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2 className="otp-title">Traval Buddy</h2>
        <p className="otp-subtitle">
          We've sent a 6-digit verification code to <b>{email}</b>.
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

          <button type="submit" className="otp-button">
            Verify OTP
          </button>
        </form>

        <p className="resend-text">
          Didn't receive the code? <a href="#">Resend</a>
        </p>
      </div>
    </div>
  );
};

export default VarifyOtp;
