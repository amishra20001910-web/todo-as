import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{message}</p>
    </div>
  );
};

export default Loading;
