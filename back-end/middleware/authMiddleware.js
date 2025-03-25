const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

// validasi token jwt
const protectedMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res
        .status(401)
        .json({status: 'fail', message: 'No token provided, please log in'});
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    return res.status(401).json({status: 'fail', message: 'Invalid or expired token', error: error.message});
  }
});

// validasi admin
const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    const error = new Error('Access denied, admin privileges required');
    error.statusCode = 403;
    throw error;
  }
});

// validasi user untuk akses pages web
const isUser = (req, res, next) => {
  if (!req.user) {
    const error = new Error('Unauthorized, please log in');
    error.statusCode = 401;
    throw error;
  }

  if (req.user.role !== 'user') {
    const error = new Error('Forbidden, only users can access this');
    error.statusCode = 403;
    throw error; // Lempar error
  }
  next();
};

// Redirect ke dashboard jika sudah login
const isGuest = (req, res, next) => {
  if (req.cookies.jwt) {
    return res.redirect('/dashboard');
  }
  next();
};

// proteksi user berdasarkan id url dan token jwt
const protectedUser = (req, res, next) => {
  const userId = req.params.id;

  // admin bisa akses setaip dashboard user
  if (req.user && req.user.role === 'admin') {
    next();
  }
  if (!req.user) {
    const error = new Error('User not authenticated');
    error.statusCode = 401;
    throw error;
  }

  if (req.user._id.toString() !== userId) {
    const error = new Error('Forbidden, access denied for this user');
    error.statusCode = 403;
    throw error;
  }

  next();
};

module.exports = {
  protectedMiddleware,
  isAdmin,
  isUser,
  isGuest,
  protectedUser,
};
