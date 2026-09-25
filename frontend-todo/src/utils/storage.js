/**
 * Storage utility for managing JWT tokens and cached user info in localStorage.
 */

const TOKEN_KEY = 'todo_auth_token';
const USER_KEY = 'todo_auth_user';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    console.error('Error reading token from localStorage', e);
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {
    console.error('Error saving token to localStorage', e);
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Error removing token from localStorage', e);
  }
};

export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Error reading user from localStorage', e);
    return null;
  }
};

export const setUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (e) {
    console.error('Error saving user to localStorage', e);
  }
};

export const clearAuth = () => {
  removeToken();
  try {
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Error clearing auth from localStorage', e);
  }
};
