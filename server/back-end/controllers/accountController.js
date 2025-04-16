const asyncHandler = require('../middleware/asyncHandler');
const Account = require('../models/Account');

const getDetailAccountHandler = asyncHandler( async (req, res) => {
  try {
    const {accountId} = req.params;
    if (!accountId) {
      return res.status(400).json({status: 'fail', message: 'Invalid account ID'});
    }
    const account = await Account.findById(accountId).populate('transactions');
    if (!account) {
      return res.status(404).json({status: 'fail', message: 'Account not found'});
    }
    res.json({status: 'success', message: 'Berhasil mendapat data account', data: account});
  } catch (error) {
    console.error(error);
    res.status(500).json({status: 'fail', message: 'Terjadi kesalahan server', error: error.message});
  }
});

// GET /accounts?userId=xxx
const getAccountsByUserId = asyncHandler(async (req, res) => {
  const {userId} = req.query;

  if (!userId) {
    return res.status(400).json({status: 'fail', message: 'userId tidak ditemukan di query'});
  }

  const accounts = await Account.find({user_id: userId});

  res.status(200).json({
    status: 'success',
    message: 'Berhasil mengambil semua akun milik user',
    results: accounts.length,
    data: accounts,
  });
});
module.exports = {getDetailAccountHandler, getAccountsByUserId};
