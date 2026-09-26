const { verifyToken } = require('../utils/token');
const { sendError } = require('../utils/apiResponse');

/**
 * Middleware to protect routes and verify JWT.
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendError(res, 'Authentication token missing or invalid format.', 401);
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return sendError(res, 'Invalid token payload.', 401);
    }

    // Attach authenticated user payload to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Authentication token has expired. Please log in again.', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid authentication token.', 401);
    }
    return sendError(res, 'Authentication failed.', 401);
  }
};

module.exports = authMiddleware;
