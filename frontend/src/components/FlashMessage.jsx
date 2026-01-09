import React from 'react';
import { useFlashMessage } from '../context/FlashMessageContext';
import './FlashMessage.css';

const FlashMessage = () => {
  const { messages, removeMessage } = useFlashMessage();

  if (messages.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className="flash-message-container">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flash-message flash-message-${msg.type}`}
          onClick={() => removeMessage(msg.id)}
        >
          <span className="flash-message-icon">{getIcon(msg.type)}</span>
          <span className="flash-message-text">{msg.message}</span>
          <button
            className="flash-message-close"
            onClick={(e) => {
              e.stopPropagation();
              removeMessage(msg.id);
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default FlashMessage;

