import React, { useState, useRef, useEffect } from 'react';

const VarifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

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
    console.log('OTP Submitted:', otpCode);
    // Add your verification logic here
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

        .otp-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
        }

        .otp-card {
          background-color: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 420px;
          text-align: center;
        }

        .otp-title {
          font-size: 32px;
          font-weight: 700;
          color: #4CAF50;
          margin-bottom: 8px;
        }

        .otp-subtitle {
          color: #666;
          margin-bottom: 40px;
          font-size: 15px;
          line-height: 1.6;
        }

        .otp-inputs {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 30px;
        }

        .otp-input {
          width: 50px;
          height: 60px;
          text-align: center;
          font-size: 24px;
          font-weight: 600;
          border: 2px solid #ddd;
          border-radius: 10px;
          background-color: #fff;
          transition: all 0.3s;
        }

        .otp-input:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.15);
        }

        .otp-button {
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

        .otp-button:hover {
          background-color: #45a049;
        }

        .resend-text {
          color: #666;
          font-size: 14px;
          margin-top: 20px;
        }

        .resend-text a {
          color: #4CAF50;
          text-decoration: none;
          font-weight: 500;
        }

        .resend-text a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .otp-input {
            width: 45px;
            height: 55px;
            font-size: 20px;
          }

          .otp-inputs {
            gap: 10px;
          }

          .otp-card {
            padding: 30px 20px;
          }

          .otp-title {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="otp-container">
        <div className="otp-card">
          <h2 className="otp-title">Traval Buddy</h2>
          <p className="otp-subtitle">
            We've sent a 6-digit verification code to your email. Please enter it below to continue.
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
    </>
  );
};

export default VarifyOtp;