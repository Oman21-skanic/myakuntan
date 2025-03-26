const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
  protectedMiddleware,
  protectedUser,
} = require('../middleware/authMiddleware');
const {
  redirectDashboard,
  userDashboard,
} = require('../controllers/dashboardController');

// routes dashboard page
router.get('/', protectedMiddleware, userDashboard);

module.exports = router;
