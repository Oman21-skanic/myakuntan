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
    req.user = await User.findById(decoded.id).select('_id name email');
    next();
  } catch (error) {
    return res.status(401).json({status: 'fail', message: 'Invalid or expired token', data: error.message});
  }
});

// validasi admin
const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({status: 'fail', message: 'You do not have permission'});
  }
});

// validasi user untuk akses pages web
const isUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized, please log in',
    });
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

  // admin bisa akses setiap dashboard user
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  if (!req.user) {
    return res.status(401).json({
      status: 'fail',
      message: 'User not authenticated',
    });
  }

  if (req.user._id.toString() !== userId) {
    return res.status(403).json({
      status: 'fail',
      message: 'Forbidden, access denied for this user',
    });
  }

  next();
};

const otpMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.tempToken;
  try {
    if (!token) {
      throw new Error('invalid token. register ulang');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
    console.log( decoded);
    req.user = await User.findOne({email: decoded.email}).select('_id email name');
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(401).json({status: 'fail', message: error.message ? error.message : 'invalid or error token', data: error.message});
  }
});

const resetPasswordMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.resetToken;
  try {
    if (!token) {
      throw new Error('invalid token. register ulang');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
    console.log( decoded);
    req.user = await User.findOne({email: decoded.email}).select('_id email name');
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(401).json({status: 'fail', message: error.message ? error.message : 'invalid or error token', error: error.message});
  }
});

module.exports = {
  protectedMiddleware, isAdmin, isUser, isGuest, protectedUser, otpMiddleware,
  resetPasswordMiddleware,
};
