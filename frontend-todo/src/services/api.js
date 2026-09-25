import { getToken, clearAuth } from '../utils/storage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Perform an HTTP request to the Express backend API.
 * @param {string} endpoint - API path (e.g. '/auth/login', '/todos')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      if (response.status === 401) {
        // If unauthorized and not hitting auth endpoints, clear credentials
        if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
          clearAuth();
          window.dispatchEvent(new Event('auth:unauthorized'));
        }
      }
      const errorMessage = data && data.message ? data.message : `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to backend server. Please verify backend is running on port 5000.');
    }
    throw error;
  }
}
