/* eslint-disable new-cap */
const express = require('express');
const {createLedgerHandler, getLedgerHandler, deleteLedgerHandler, updateLedgerHandler} = require('../controllers/ledgerController');
const {protectedMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();


// Create a new ledger
// POST /api/ledger {userID, ledgerName, ledgerType: jasa/dagang}
router.post('/', protectedMiddleware, createLedgerHandler);

// mengambil data buku besar berdasarkan id
router.get('/:ledgerId', protectedMiddleware, getLedgerHandler);

// update data name buku besar berdasarkan id {name}
router.put('/:ledgerId', protectedMiddleware, updateLedgerHandler);

// delete data buku besar berdasarkan id beserta account dan transaksi didalamnya serta ledgerId pada user yang terkait
router.delete('/:ledgerId', protectedMiddleware, deleteLedgerHandler);

module.exports = router;
