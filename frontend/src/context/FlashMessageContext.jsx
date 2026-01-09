import React, { createContext, useContext, useState, useCallback } from 'react';

const FlashMessageContext = createContext();

export const useFlashMessage = () => {
  const context = useContext(FlashMessageContext);
  if (!context) {
    throw new Error('useFlashMessage must be used within FlashMessageProvider');
  }
  return context;
};

export const FlashMessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const showMessage = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    const newMessage = { id, message, type };
    
    setMessages((prev) => [...prev, newMessage]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, 4000);

    return id;
  }, []);

  const removeMessage = useCallback((id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  const showSuccess = useCallback((message) => showMessage(message, 'success'), [showMessage]);
  const showError = useCallback((message) => showMessage(message, 'error'), [showMessage]);
  const showWarning = useCallback((message) => showMessage(message, 'warning'), [showMessage]);

  const value = {
    messages,
    showMessage,
    showSuccess,
    showError,
    showWarning,
    removeMessage,
  };

  return (
    <FlashMessageContext.Provider value={value}>
      {children}
    </FlashMessageContext.Provider>
  );
};

