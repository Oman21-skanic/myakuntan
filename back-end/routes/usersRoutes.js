const express = require("express");
const {
  protectedMiddleware,
  isAdmin,
} = require("../middleware/authMiddleware");
const { allUser, getUserById } = require("../controllers/userController");
const router = express.Router();

router.get("/all", protectedMiddleware, isAdmin, allUser);
router.get("/user/:id", protectedMiddleware, getUserById);
module.exports = router;
