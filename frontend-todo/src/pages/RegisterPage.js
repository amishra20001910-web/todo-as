import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ErrorMessage from '../components/ErrorMessage';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isAuthenticated, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!name.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }

    if (!password) {
      setLocalError('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = await register(name.trim(), email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/todos');
    }
  };

  const displayError = localError || authError;

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div
            className="brand-icon"
            style={{ margin: '0 auto 1rem', width: '48px', height: '48px', fontSize: '1.4rem' }}
          >
            ✓
          </div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join TaskFlow to organize your work and life</p>
        </div>

        <ErrorMessage message={displayError} onClose={() => setLocalError('')} />

        <form onSubmit={handleSubmit} id="register-form">
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              className="form-control"
              placeholder="Vinay Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              className="form-control"
              placeholder="vinay@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">
              Password (min. 6 characters)
            </label>
            <input
              id="reg-password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm-password" className="form-label">
              Confirm Password
            </label>
            <input
              id="reg-confirm-password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            id="register-submit-btn"
            disabled={isSubmitting}
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" id="to-login-link" style={{ fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
