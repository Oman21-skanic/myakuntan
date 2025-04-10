const asyncHandler = require('../middleware/asyncHandler');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

const getTransactionById = asyncHandler( async (req, res) => {
  try {
    const {transactionId} = req.params;
    if (!transactionId) {
      return res.status(400).json({status: 'fail', message: 'Invalid transaction ID'});
    }
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({status: 'fail', message: 'Transaksi not found'});
    }
    res.json({status: 'success', message: 'berhasil mendapat data transaksi', data: transaction});
  } catch (error) {
    console.error(error);
    res.status(500).json({status: 'fail', message: 'Terjadi kesalahan server', error: error.message});
  }
});

const getTransactions = asyncHandler(async (req, res) => {
  try {
    const {userId, accountId} = req.query;
    const currentUser = req.user;
    const filter = {};

    // === Akses by userId ===
    if (userId) {
      if (
        currentUser.role !== 'admin' &&
        currentUser._id.toString() !== userId
      ) {
        return res.status(403).json({
          status: 'fail',
          message: 'Access denied: not your transactions',
        });
      }
      filter.userId = userId;
    }

    // === Akses by accountId ===
    if (accountId) {
      const account = await Account.findById(accountId);
      if (!account) {
        return res.status(404).json({
          status: 'fail',
          message: 'Account not found',
        });
      }

      if (
        currentUser.role !== 'admin' &&
        account.userId.toString() !== currentUser._id.toString()
      ) {
        return res.status(403).json({
          status: 'fail',
          message: 'Access denied: not your transactions',
        });
      }

      filter.accountId = accountId;
    }

    // === Gak ada query: hanya admin boleh akses semua ===
    if (!userId && !accountId) {
      if (currentUser.role !== 'admin') {
        return res.status(403).json({
          status: 'fail',
          message: 'Only admin can access all transactions',
        });
      }
    }

    const transactions = await Transaction.find(filter);

    res.status(200).json({
      status: 'success',
      message: 'berhasil mendapat transaksi',
      results: transactions.length,
      data: transactions,
    });
  } catch (err) {
    console.error('Get Transactions Error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching transactions',
    });
  }
});

module.exports = {getTransactionById, getTransactions};
