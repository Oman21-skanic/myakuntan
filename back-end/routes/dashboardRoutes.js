const express = require("express");
const router = express.Router();
const {
  protectedMiddleware,
  isUser,
  protectedUser,
} = require("../middleware/authMiddleware");
const {
  redirectDashboard,
  userDashboard,
} = require("../controllers/dashboardControler");

// redirect dari dashboard ke dashboard user
router.get("/", protectedMiddleware, isUser, redirectDashboard);

// dashboard user
router.get("/user/:id", protectedMiddleware, protectedUser, userDashboard);

module.exports = router;
