const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
  registerUser, loginUser, logoutUser, currentUser, googleLogin, googleCallback,
  verifyUserOTP, sendOtpHandler,
  verifyResetPasswordByEmail,
  updatePasswordByEmail,
  resetPasswordByEmail,
} = require('../controllers/authController');
const {protectedMiddleware, otpMiddleware, resetPasswordMiddleware} = require('../middleware/authMiddleware');

// google  route
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);

router.post('/login', loginUser);

router.post('/register', registerUser);

router.post('/logout', protectedMiddleware, logoutUser);

router.get('/me', protectedMiddleware, currentUser);

// send ulang kode otp
router.post('/otp', otpMiddleware, sendOtpHandler);
// otp verify
router.post('/otp/verify', otpMiddleware, verifyUserOTP);

// reset password by email {email}
router.post('/reset-password', resetPasswordByEmail);

// verify reset password {otp}
router.post('/reset-password/verify', otpMiddleware, verifyResetPasswordByEmail);

// update password setelah verify otp {password}
router.put('/reset-password/verify/update-password', resetPasswordMiddleware, updatePasswordByEmail );
module.exports = router;
