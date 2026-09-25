import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ErrorMessage from '../components/ErrorMessage';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const origin = location.state?.from?.pathname || '/todos';
      navigate(origin, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }

    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email.trim(), password);
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
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to manage your tasks and stay productive</p>
        </div>

        <ErrorMessage message={displayError} onClose={() => setLocalError('')} />

        <form onSubmit={handleSubmit} id="login-form">
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <label htmlFor="login-password" className="form-label" style={{ margin: 0 }}>
                Password
              </label>
            </div>
            <input
              id="login-password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            id="login-submit-btn"
            disabled={isSubmitting}
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" id="to-register-link" style={{ fontWeight: 600 }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
