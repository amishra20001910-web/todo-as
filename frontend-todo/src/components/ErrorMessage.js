import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="alert alert-danger" role="alert">
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          className="alert-close"
          onClick={onClose}
          aria-label="Close error message"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
