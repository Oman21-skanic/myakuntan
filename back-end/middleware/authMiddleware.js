const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');
const mongoose = require('mongoose');

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

    const user = await User.findById(decoded.id).select('_id name email role');
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'User not found. Please log in again.',
      });
    }

    req.user = user;
    console.log(req.user, req.user._id.toString());
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token',
      data: error.message,
    });
  }
});

// validasi admin
const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({
      status: 'fail',
      message: 'You do not have permission',
    });
  }
});

// validasi user biasa (akses web page)
const isUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized, please log in',
    });
  }
  next();
};

// redirect kalau udah login
const isGuest = asyncHandler(async (req, res, next) => {
  if (req.cookies.jwt) {
    return res.redirect('/dashboard');
  }
  next();
});

// validasi akses spesifik user atau admin
const protectedUser = asyncHandler(async (req, res, next) => {
  const userIdFromParams = req.params.id;
  const userIdFromQuery = req.query.userId;
  const currentUserId = req.user?._id?.toString();

  if (!req.user) {
    return res.status(401).json({
      status: 'fail',
      message: 'User not authenticated',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userIdFromParams)) {
    return res.status(400).json({
      status: 'fail',
      message: 'ID tidak valid',
    });
  }

  const user = await User.findById(userIdFromParams);
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User tidak ditemukan',
    });
  }

  // Admin bisa akses semua user
  if (req.user.role === 'admin') {
    return next();
  }

  const targetUserId = userIdFromParams || userIdFromQuery;
  if (currentUserId !== targetUserId) {
    return res.status(403).json({
      status: 'fail',
      message: 'Forbidden, access denied for this user',
    });
  }

  next();
});

// validasi otp (pakai tempToken)
const otpMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.tempToken;

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Token tidak ditemukan. Silakan daftar ulang.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });

    req.user = await User.findOne({email: decoded.email}).select(
        '_id email name',
    );
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: error.message || 'Invalid or error token',
    });
  }
});

// validasi reset password token (pakai resetToken)
const resetPasswordMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.resetToken;

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Token tidak ditemukan. Silakan daftar ulang.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });

    req.user = await User.findOne({email: decoded.email}).select(
        '_id email name',
    );
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: error.message || 'Invalid or error token',
    });
  }
});

module.exports = {
  protectedMiddleware,
  isAdmin,
  isUser,
  isGuest,
  protectedUser,
  otpMiddleware,
  resetPasswordMiddleware,
};
