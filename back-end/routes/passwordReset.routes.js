const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
  verifyResetPasswordByEmail,
  updatePasswordByEmail,
  resetPasswordByEmail,
} = require('../controllers/passwordResetController');
const {otpMiddleware, resetPasswordMiddleware} = require('../middleware/authMiddleware');

// reset password by email kirim otp {email}
router.post('/', resetPasswordByEmail);

// verify reset password {otp}
router.post('/verify', otpMiddleware, verifyResetPasswordByEmail);

// update password setelah verify otp {password}
router.put('/', resetPasswordMiddleware, updatePasswordByEmail );
module.exports = router;
