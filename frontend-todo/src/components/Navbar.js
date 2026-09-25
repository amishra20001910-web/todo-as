import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="navbar-inner">
        <Link to={isAuthenticated ? '/todos' : '/login'} className="nav-brand">
          <div className="brand-icon">✓</div>
          <span>TaskFlow</span>
        </Link>

        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <div className="user-badge" title={user?.email || ''}>
                <span className="user-avatar">{getInitials(user?.name)}</span>
                <span>{user?.name || 'User'}</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleLogout}
                id="logout-button"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm" id="nav-login-btn">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
