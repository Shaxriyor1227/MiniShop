const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT Bearer token
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Kirish uchun token taqdim etilmagan (Token is missing)',
        innerData: null
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'minishop_super_secret_jwt_key_2026_experience');
    req.user = decoded; // { id, email, role, ... }
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Yaroqsiz yoki muddati o\'tgan token (Invalid or expired token)',
      innerData: null
    });
  }
};

/**
 * Middleware to restrict route to admin role only
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Ruxsat etilmagan amal: Faqat admin foydalanuvchilar uchun (Admin access required)',
      innerData: null
    });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin
};
