/* eslint-disable new-cap */
const express = require('express');
const {protectedMiddleware} = require('../middleware/authMiddleware');
const {getTransactionById, getTransactions, createTransaction, updateTransaction, deleteTransaction} = require('../controllers/transactionController');
const verifyTransactionOwnership = require('../middleware/transactionMiddleware');
const router = express.Router();

// Create transaksi {userId, tanggal(iso string), keterangan, nominal, akun_debit_id, akun_credit_id}
router.post('/', protectedMiddleware, createTransaction );

// get transactions dengan query userId atau accountId jika tanpa query akan mendapat semua transaksi(admin previlege)
router.get('/', protectedMiddleware, getTransactions);

// get spesific transaksi routes {transactionId}
router.get('/:transactionId', protectedMiddleware, verifyTransactionOwnership, getTransactionById);

// update specific transaction params transactionId {tanggal(iso string), keterangan, nominal, akun_debit_id, akun_credit_id}
router.put('/:transactionId', protectedMiddleware, verifyTransactionOwnership, updateTransaction);

// delete specific transaction params transactionId
router.delete('/:transactionId', protectedMiddleware, verifyTransactionOwnership, deleteTransaction);


module.exports = router;
