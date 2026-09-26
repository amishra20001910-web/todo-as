const AuthService = require('../services/authService');
const { sendSuccess } = require('../utils/apiResponse');

class AuthController {
  /**
   * Handle user registration.
   * POST /api/auth/register
   */
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.register({ name, email, password });
      return sendSuccess(res, 'User registered successfully', result, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle user login.
   * POST /api/auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      return sendSuccess(res, 'Login successful', result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle get current user profile.
   * GET /api/auth/me
   */
  static async getMe(req, res, next) {
    try {
      const user = await AuthService.getCurrentUser(req.user.id);
      return sendSuccess(res, 'User profile retrieved successfully', { user }, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle user logout.
   * POST /api/auth/logout
   */
  static async logout(req, res, next) {
    try {
      // In stateless JWT auth, client clears token from storage.
      return sendSuccess(res, 'Logged out successfully', null, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
