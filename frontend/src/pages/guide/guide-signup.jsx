import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateSignup } from '../../validations/signupValidation';
import { useFlashMessage } from '../../context/FlashMessageContext';
import './guide-signup.css';

const GuideSignup = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useFlashMessage();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: Details
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    fullAddress: '',
    password: '',
    confirmPassword: '',
  });

  // Step 2: Selfie
  const [selfie, setSelfie] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  // Step 3: Aadhaar
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [aadhaarFrontPreview, setAadhaarFrontPreview] = useState(null);
  const [aadhaarBackPreview, setAadhaarBackPreview] = useState(null);

  // Step 4: OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  // Collected data
  const [collectedData, setCollectedData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Step 1: Save Details
  const handleStep1 = async (e) => {
    e.preventDefault();

    const error = validateSignup(formData);
    if (error) {
      showError(error);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('http://localhost:5000/api/guide/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.message);
        return;
      }

      setCollectedData({ ...collectedData, ...formData });
      setStep(2);
    } catch (err) {
      showError('Failed to save details');
    } finally {
      setLoading(false);
    }
  };

  // Effect to set video stream when camera becomes active
  useEffect(() => {
    if (cameraActive && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraActive, cameraStream]);

  // Webcam functions
  const startCamera = async () => {
    try {
      // Check if we're in a secure context (HTTPS or localhost)
      if (!window.isSecureContext && window.location.protocol !== 'http:') {
        showError('Camera access requires a secure connection (HTTPS). Please use HTTPS or localhost for testing.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      setCameraStream(stream);
      setCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);

      if (err.name === 'NotAllowedError') {
        showError('Camera access denied. Please allow camera permissions in your browser settings and click "Open Camera" again.');
      } else if (err.name === 'NotFoundError') {
        showError('No camera found on this device. Please connect a camera and try again.');
      } else if (err.name === 'NotSupportedError') {
        showError('Camera access is not supported in this browser. Please use a modern browser like Chrome or Firefox.');
      } else if (err.name === 'NotReadableError') {
        showError('Camera is already in use by another application. Please close other apps using the camera.');
      } else if (err.name === 'OverconstrainedError') {
        showError('Camera settings are not supported. Trying basic camera access...');
        // Fallback to basic video constraints
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setCameraStream(fallbackStream);
          setCameraActive(true);
        } catch (fallbackErr) {
          console.error('Fallback camera access failed:', fallbackErr);
          showError('Unable to access camera with current settings. Please try a different browser or device.');
        }
      } else {
        showError(`Camera access failed: ${err.message || 'Unknown error'}. Please check your browser permissions and try again.`);
      }
    }
  };

  const captureSelfie = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      setSelfie(blob);
      setSelfiePreview(canvas.toDataURL());
      stopCamera();
    });
  };

  const stopCamera = () => {
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  // Step 2: Upload Selfie
  const handleStep2 = async () => {
    if (!selfie) {
      showError('Please capture a selfie');
      return;
    }

    try {
      setLoading(true);

      const formDataUpload = new FormData();
      formDataUpload.append('selfie', selfie);

      const res = await fetch('http://localhost:5000/api/guide/upload-selfie', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.message);
        return;
      }

      setCollectedData({ ...collectedData, selfieUrl: data.selfieUrl });
      setStep(3);
    } catch (err) {
      showError('Failed to upload selfie');
    } finally {
      setLoading(false);
    }
  };

  // Handle file uploads
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'front') {
      setAadhaarFront(file);
      setAadhaarFrontPreview(URL.createObjectURL(file));
    } else {
      setAadhaarBack(file);
      setAadhaarBackPreview(URL.createObjectURL(file));
    }
  };

  // Step 3: Upload Aadhaar
  const handleStep3 = async () => {
    if (!aadhaarFront || !aadhaarBack) {
      showError('Please upload both Aadhaar images');
      return;
    }

    try {
      setLoading(true);

      const formDataUpload = new FormData();
      formDataUpload.append('aadhaarFront', aadhaarFront);
      formDataUpload.append('aadhaarBack', aadhaarBack);

      const [uploadRes] = await Promise.all([
        fetch('http://localhost:5000/api/guide/upload-aadhaar', {
          method: 'POST',
          body: formDataUpload,
        }),
        sendOtp()
      ]);

      const data = await uploadRes.json();

      if (!uploadRes.ok) {
        showError(data.message);
        return;
      }

      setCollectedData({
        ...collectedData,
        aadhaarFrontUrl: data.aadhaarFrontUrl,
        aadhaarBackUrl: data.aadhaarBackUrl
      });
      setStep(4);
    } catch (err) {
      showError('Failed to upload Aadhaar');
    } finally {
      setLoading(false);
    }
  };

  // Send OTP
  const sendOtp = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/guide/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.message);
      } else {
        if (data.devOtp) {
          // Email failed, show OTP for testing
          showSuccess(`Email service unavailable. Use OTP: ${data.devOtp}`);
        } else {
          showSuccess('OTP sent to your email');
        }
      }
    } catch (err) {
      showError('Failed to send OTP');
    }
  };

  // Handle OTP change
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Step 4: Verify OTP
  const handleStep4 = async (e) => {
    e.preventDefault();

    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      showError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('http://localhost:5000/api/guide/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...collectedData,
          otp: otpValue,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.message);
        return;
      }

      showSuccess('Guide registration submitted successfully');
      navigate('/guide/login'); // Redirect to guide login page
    } catch (err) {
      console.error('OTP verification error:', err);
      showError('OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guide-signup-container">
      <div className="guide-signup-card">
        <h2 className="guide-signup-title">Guide Signup</h2>
        <div className="step-indicator">
          Step {step} of 4
        </div>

        {step === 1 && (
          <form onSubmit={handleStep1} className="signup-form">
            <div className="input-group">
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="input-group">
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="input-group">
              <input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="input-group">
              <input
                id="fullAddress"
                type="text"
                value={formData.fullAddress}
                onChange={handleChange}
                placeholder="Enter your full address (as per Aadhaar)"
                required
              />
            </div>
            <div className="input-group password-input-group">
              <div className="password-field">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
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
            </div>
            <div className="input-group password-input-group">
              <div className="password-field">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? (
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
            </div>
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? 'Saving...' : 'Next'}
            </button>
            <p className="login-link">
              Already have an account? <a href="/guide/login">Log In</a>
            </p>
            <p className="traveller-link">
              <a href="/traveller/signup">Signup as a Traveller</a>
            </p>
          </form>
        )}

        {step === 2 && (
          <div className="selfie-step">
            <h3>Capture Selfie</h3>
            <p className="camera-instructions">
              Please allow camera access when prompted. Make sure you're in a well-lit area and your face is clearly visible.
            </p>

            {!cameraActive && !selfiePreview && (
              <div className="selfie-options">
                <button onClick={startCamera} className="camera-button">
                  📷 Open Camera
                </button>
                <p className="or-text">or</p>
                <button onClick={() => setUseFileUpload(true)} className="upload-button">
                  📁 Upload Photo
                </button>
              </div>
            )}

            {useFileUpload && !selfiePreview && (
              <div className="file-upload-section">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelfie(file);
                      setSelfiePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="file-input"
                />
                <button onClick={() => setUseFileUpload(false)} className="switch-button">
                  Use Camera Instead
                </button>
              </div>
            )}
            {cameraActive && (
              <div>
                <video ref={videoRef} autoPlay className="video-preview"></video>
                <button onClick={captureSelfie} className="capture-button">
                  Capture Selfie
                </button>
                <button onClick={stopCamera} className="stop-button">
                  Stop Camera
                </button>
              </div>
            )}
            {selfiePreview && (
              <div>
                <img src={selfiePreview} alt="Selfie" className="selfie-preview" />
                <div className="button-group">
                  <button onClick={() => { setSelfie(null); setSelfiePreview(null); }} className="retake-button">
                    Retake
                  </button>
                  <button onClick={handleStep2} className="next-button" disabled={loading}>
                    {loading ? 'Uploading...' : 'Next'}
                  </button>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          </div>
        )}

        {step === 3 && (
          <div className="aadhaar-step">
            <h3>Upload Aadhaar</h3>
            <div className="upload-section">
              <div>
                <label>Aadhaar Front</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'front')}
                />
                {aadhaarFrontPreview && <img src={aadhaarFrontPreview} alt="Aadhaar Front" className="image-preview" />}
              </div>
              <div>
                <label>Aadhaar Back</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'back')}
                />
                {aadhaarBackPreview && <img src={aadhaarBackPreview} alt="Aadhaar Back" className="image-preview" />}
              </div>
            </div>
            <button onClick={handleStep3} className="upload-button" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload and Send OTP'}
            </button>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleStep4} className="otp-form">
            <p>We've sent a 6-digit verification code to {formData.email}</p>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  ref={(el) => (otpRefs.current[index] = el)}
                  className="otp-input"
                />
              ))}
            </div>
            <button type="submit" className="verify-button" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default GuideSignup;
