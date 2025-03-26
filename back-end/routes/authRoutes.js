const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  googleLogin,
  googleCallback,
  verifyUserOTP,
} = require('../controllers/authController');
const {protectedMiddleware} = require('../middleware/authMiddleware');

// google  route
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);

router.post('/login', loginUser);

router.post('/register', registerUser);

router.post('/logout', protectedMiddleware, logoutUser);

router.get('/me', protectedMiddleware, currentUser);

// otp verify
router.post('/verify-otp', verifyUserOTP);
module.exports = router;
