const asyncHandler = require('../middleware/asyncHandler');
const Account = require('../models/Account');

const getAccountHandler = asyncHandler( async (req, res) => {
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

// GET ALL ACCOUNTS BY LEDGER ID
const getAllAccountsHandler = asyncHandler(async (req, res) => {
  try {
    const {ledgerId} = req.params;
    if (!ledgerId) {
      return res.status(400).json({status: 'fail', message: 'Invalid ledger ID'});
    }
    const accounts = await Account.find({ledgerId}).populate('transactions');
    res.json({status: 'success', message: 'Berhasil mendapat data semua account', data: accounts});
  } catch (error) {
    console.error(error);
    res.status(500).json({status: 'fail', message: 'Terjadi kesalahan server', error: error.message});
  }
});

module.exports = {getAccountHandler, getAllAccountsHandler};
