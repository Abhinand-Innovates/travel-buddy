import { useNavigate } from "react-router-dom";

const LoginRequiredModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate("/customerLogin");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Login Required</h2>
        <p>Please login to continue searching guides.</p>

        <div className="modal-actions">
          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-box {
          background: white;
          padding: 30px;
          border-radius: 14px;
          width: 90%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .modal-box h2 {
          margin-bottom: 10px;
          color: #333;
        }

        .modal-box p {
          color: #666;
          margin-bottom: 24px;
        }

        .modal-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .login-btn {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .login-btn:hover {
          background-color: #45a049;
        }

        .cancel-btn {
          background-color: #eee;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default LoginRequiredModal;
