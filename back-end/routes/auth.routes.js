const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
  loginUser, logoutUser,
  googleOAuthApiHandler,
  sendOtpHandler,
  verifyUserOTP,
} = require('../controllers/authController');
const {protectedMiddleware, otpMiddleware} = require('../middleware/authMiddleware');

// google auth handler
router.post('/google', googleOAuthApiHandler);

// login user routes {email, password}
router.post('/sessions', loginUser);

// logout user routes
router.delete('/sessions', protectedMiddleware, logoutUser);

// resend code OTP
router.post('/otp', otpMiddleware, sendOtpHandler);
// otp verify
router.post('/otp/verify', otpMiddleware, verifyUserOTP);

module.exports = router;
