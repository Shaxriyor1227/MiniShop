const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT Bearer token
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.sendResponse(401, 'AUTH_TOKEN_MISSING');
    }

    const token = authHeader.split(' ')[1];
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role, ... }
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error.message);
    return res.sendResponse(401, 'AUTH_TOKEN_INVALID');
  }
};

/**
 * Middleware to restrict route to admin role only
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.sendResponse(403, 'FORBIDDEN_ADMIN_ONLY');
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin
};

