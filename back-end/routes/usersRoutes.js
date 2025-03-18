const express = require("express");
const {
  protectedMiddleware,
  isAdmin,
} = require("../middleware/authMiddleware");
const { allUser, getUserById } = require("../controllers/userController");
const router = express.Router();

// previlege admin get all user
router.get("/all", protectedMiddleware, isAdmin, allUser);
// get user berdasarkan id
router.get("/user/:id", protectedMiddleware, getUserById);
module.exports = router;
