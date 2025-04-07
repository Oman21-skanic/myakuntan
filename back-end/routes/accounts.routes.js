/* eslint-disable new-cap */
const express = require('express');
const {protectedMiddleware} = require('../middleware/authMiddleware');
const {getAccountHandler, getAllAccountsHandler} = require('../controllers/accountController');

const router = express.Router();

// mengambil data detail account by id account
router.get('/:accountId', protectedMiddleware, getAccountHandler);

// mengambil data all account by ledger id
router.get('/ledger/:ledgerId', protectedMiddleware, getAllAccountsHandler);

module.exports = router;
