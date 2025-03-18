const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  googleLogin,
  googleCallback,
  verifyUserOTP,
} = require("../controllers/authController");
const {
  protectedMiddleware,
  isGuest,
  isUser,
} = require("../middleware/authMiddleware");

// google  route
router.get("/google", isGuest, googleLogin);
router.get("/google/callback", googleCallback);

router.post("/login", loginUser);

router.post("/register", registerUser);

router.post("/logout", protectedMiddleware, isUser, logoutUser);

router.get("/user", protectedMiddleware, currentUser);

// otp verify
router.post("/verify-otp", verifyUserOTP);
module.exports = router;
