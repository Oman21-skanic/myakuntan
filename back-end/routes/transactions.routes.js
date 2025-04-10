/* eslint-disable new-cap */
const express = require('express');
const {protectedMiddleware} = require('../middleware/authMiddleware');
const {getTransactionById, getTransactions} = require('../controllers/transactionController');
const router = express.Router();

// Create transaksi {accountId, ledgerId, amount, description, action}
router.post('/', protectedMiddleware );

// get transactions dengan query userId atau accountId jika tanpa query akan mendapat semua transaksi(admin previlege)
router.get('/', protectedMiddleware, getTransactions);

// get spesific transaksi routes {transactionId}
router.get('/:transactionId', protectedMiddleware, getTransactionById);

// update specific transaction params transactionId { amount, description, action }
router.put('/:transactionId', protectedMiddleware);

// delete specific transaction params transactionId
router.delete('/:transactionId', protectedMiddleware);


module.exports = router;
