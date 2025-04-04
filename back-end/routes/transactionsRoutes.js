/* eslint-disable new-cap */
const express = require('express');
const {protectedMiddleware} = require('../middleware/authMiddleware');
const {createTransactionHandler, getTransactionHandler, getAllTransactionsByLedgerHandler,
  getTransactionsByAccountHandler, updateTransactionHandler,
  deleteTransactionHandler} = require('../controllers/transactionController');
const router = express.Router();

// Create transaksi {accountId, ledgerId, amount, description, action}
router.post('/', protectedMiddleware, createTransactionHandler);

// get spesific transaksi routes {transactionId}
router.get('/:transactionId', protectedMiddleware, getTransactionHandler);

// get all transaksi by ledgerId {ledgerId}
router.get('/ledger/:ledgerId', protectedMiddleware, getAllTransactionsByLedgerHandler);

// get all transaction by accountId {accountId}
router.get('/account/:accountId', protectedMiddleware, getTransactionsByAccountHandler);

// update specific transaction params transactionId { amount, description, action }
router.put('/:transactionId', protectedMiddleware, updateTransactionHandler);

// delete specific transaction params transactionId
router.delete('/:transactionId', protectedMiddleware, deleteTransactionHandler);


module.exports = router;
