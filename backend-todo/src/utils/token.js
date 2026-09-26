const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }
  return secret;
};

/**
 * Generate a signed JWT for an authenticated user.
 * @param {object} payload - { id, email, name }
 * @param {string} expiresIn - token expiry duration (default: '7d')
 * @returns {string} Signed JWT
 */
const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
};

/**
 * Verify and decode a JWT.
 * @param {string} token
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

module.exports = {
  generateToken,
  verifyToken,
};
