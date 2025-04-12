const Transaction = require('../models/Transaction');
const asyncHandler = require('./asyncHandler');
const verifyTransactionOwnership = asyncHandler(async (req, res, next) => {
  const {transactionId} = req.params;
  const currentUser = req.user;

  if (!transactionId) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid transaction ID',
    });
  }

  // Ambil transaksi
  const transaction = await Transaction.findById(transactionId).select('user_id');

  if (!transaction) {
    return res.status(404).json({
      status: 'fail',
      message: 'Transaction not found',
    });
  }

  if (currentUser.role === 'admin') return next();

  // validasi apakah user yang sama
  if (transaction.user_id.toString() !== currentUser._id.toString()) {
    return res.status(403).json({
      status: 'fail',
      message: 'Access denied: not your transaction',
    });
  }

  next();
});

module.exports = verifyTransactionOwnership;
