import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import {
  getToken,
  setToken,
  getUser,
  setUser,
  clearAuth,
} from '../utils/storage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setCurrentUser] = useState(() => getUser());
  const [token, setCurrentToken] = useState(() => getToken());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Synchronize and verify authentication state on initial mount
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const storedToken = getToken();

      if (!storedToken) {
        if (isMounted) {
          setCurrentUser(null);
          setCurrentToken(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await authService.getMe();
        if (isMounted && response.data && response.data.user) {
          setCurrentUser(response.data.user);
          setUser(response.data.user);
          setCurrentToken(storedToken);
        }
      } catch (err) {
        console.warn('Session verification failed:', err.message);
        if (isMounted) {
          clearAuth();
          setCurrentUser(null);
          setCurrentToken(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for unauthorized events triggered from api layer
    const handleUnauthorized = () => {
      clearAuth();
      setCurrentUser(null);
      setCurrentToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      const { user: loggedInUser, token: authToken } = response.data;

      setToken(authToken);
      setUser(loggedInUser);
      setCurrentToken(authToken);
      setCurrentUser(loggedInUser);

      return { success: true, user: loggedInUser };
    } catch (err) {
      const message = err.message || 'Login failed. Please check your credentials.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register({ name, email, password });
      const { user: registeredUser, token: authToken } = response.data;

      setToken(authToken);
      setUser(registeredUser);
      setCurrentToken(authToken);
      setCurrentUser(registeredUser);

      return { success: true, user: registeredUser };
    } catch (err) {
      const message = err.message || 'Registration failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignore network error on logout
    } finally {
      clearAuth();
      setCurrentUser(null);
      setCurrentToken(null);
      setError(null);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
