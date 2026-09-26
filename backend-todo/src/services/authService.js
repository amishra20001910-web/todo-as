const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const { generateToken } = require('../utils/token');

class AuthService {
  /**
   * Register a new user.
   * @param {object} param0 - { name, email, password }
   * @returns {Promise<object>} { user, token }
   */
  static async register({ name, email, password }) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      const err = new Error('Full name is required.');
      err.statusCode = 400;
      throw err;
    }

    if (!email || typeof email !== 'string') {
      const err = new Error('Valid email address is required.');
      err.statusCode = 400;
      throw err;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      const err = new Error('Invalid email address format.');
      err.statusCode = 400;
      throw err;
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      const err = new Error('Password must be at least 6 characters long.');
      err.statusCode = 400;
      throw err;
    }

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(cleanEmail);
    if (existingUser) {
      const err = new Error('An account with this email address already exists.');
      err.statusCode = 409;
      throw err;
    }

    // Hash password with bcrypt (12 salt rounds)
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save to Supabase
    const newUser = await UserModel.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      },
      token,
    };
  }

  /**
   * Login an existing user.
   * @param {object} param0 - { email, password }
   * @returns {Promise<object>} { user, token }
   */
  static async login({ email, password }) {
    if (!email || typeof email !== 'string') {
      const err = new Error('Email is required.');
      err.statusCode = 400;
      throw err;
    }

    if (!password || typeof password !== 'string') {
      const err = new Error('Password is required.');
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await UserModel.findByEmail(cleanEmail);
    if (!user) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    // Compare bcrypt password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
    };
  }

  /**
   * Get current user profile by user ID.
   * @param {string} userId - UUID
   * @returns {Promise<object>} Safe user profile
   */
  static async getCurrentUser(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }
    return user;
  }
}

module.exports = AuthService;
