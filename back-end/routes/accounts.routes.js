/* eslint-disable new-cap */
const express = require('express');
const {protectedMiddleware, protectedUser} = require('../middleware/authMiddleware');
const {getDetailAccountHandler, getAccountsByUserId} = require('../controllers/accountController');

const router = express.Router();

// mengambil data semua account dari user id
router.get('/', getAccountsByUserId);

// mengambil data detail account by id account
router.get('/:accountId', protectedMiddleware, protectedUser, getDetailAccountHandler);
module.exports = router;
