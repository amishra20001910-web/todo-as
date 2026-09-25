import { apiRequest } from './api';

export const authService = {
  /**
   * Register a new user account.
   * @param {object} param0 - { name, email, password }
   */
  async register({ name, email, password }) {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
  },

  /**
   * Log into an existing account.
   * @param {object} param0 - { email, password }
   */
  async login({ email, password }) {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  /**
   * Fetch current authenticated user's profile.
   */
  async getMe() {
    return await apiRequest('/auth/me', {
      method: 'GET',
    });
  },

  /**
   * Log out of current session.
   */
  async logout() {
    try {
      return await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (e) {
      // Even if server call fails, client-side logout proceeds
      return { success: true };
    }
  },
};
