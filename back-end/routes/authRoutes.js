const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
} = require("../controllers/authController");
const router = express.Router();
const {
  googleLogin,
  googleCallback,
} = require("../controllers/authGoogleController");
const {
  protectedMiddleware,
  isGuest,
  isUser,
} = require("../middleware/authMiddleware");

// google  route
router.get("/google", isGuest, googleLogin);
router.get("/google/callback", googleCallback);

router.post("/login", isGuest, loginUser);

router.post("/register", isGuest, registerUser);

router.post("/logout", protectedMiddleware, isUser, logoutUser);

router.get("/user", protectedMiddleware, currentUser);
module.exports = router;
