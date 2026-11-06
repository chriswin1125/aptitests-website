const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or invalid.' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'aptitude_pro_jwt_secret_token_secure_key_2026');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is expired or invalid.' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'aptitude_pro_jwt_secret_token_secure_key_2026');
      const user = await User.findById(decoded.id).select('-password');
      if (user) req.user = user;
    }
  } catch (err) {
    // Ignore invalid token in optionalAuth
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

module.exports = { auth, optionalAuth, requireAdmin };
