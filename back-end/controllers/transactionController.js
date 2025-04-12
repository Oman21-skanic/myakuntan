/* eslint-disable camelcase */
const asyncHandler = require('../middleware/asyncHandler');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const mongoose = require('mongoose');

function applyTransaction(account, nominal, type) {
  if (type === 'debit') {
    account.debit += nominal;
    account.saldo += (account.normal_balance === 'debit') ? nominal : -nominal;
  } else {
    account.credit += nominal;
    account.saldo += (account.normal_balance === 'credit') ? nominal : -nominal;
  }
}

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
    res.status(500).json({status: 'fail', message: 'Terjadi kesalahan server', data: error.message});
  }
});
const getTransactions = asyncHandler(async (req, res) => {
  const {userId, accountId} = req.query;
  const currentUser = req.user;
  const filter = {};

  // === Validasi userId dan accountId ===
  if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid userId format',
    });
  }

  if (accountId && !mongoose.Types.ObjectId.isValid(accountId)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid accountId format',
    });
  }

  // === Akses berdasarkan userId ===
  if (userId) {
    const isNotOwner = currentUser._id.toString() !== userId;
    if (currentUser.role !== 'admin' && isNotOwner) {
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied: not your transactions',
      });
    }
    filter.user_id = userId;
  }

  // === Akses berdasarkan accountId ===
  if (accountId) {
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({
        status: 'fail',
        message: 'Account not found',
      });
    }

    const isNotAccountOwner = account.user_id.toString() !== currentUser._id.toString();
    if (currentUser.role !== 'admin' && isNotAccountOwner) {
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied: not your account',
      });
    }

    // Cari semua transaksi yang melibatkan account ini, baik sebagai debit atau credit
    filter.$or = [
      {akun_debit_id: accountId},
      {akun_credit_id: accountId},
    ];
  }

  // === Admin-only untuk akses tanpa query ===
  if (!userId && !accountId && currentUser.role !== 'admin') {
    return res.status(403).json({
      status: 'fail',
      message: 'Only admin can access all transactions',
    });
  }

  const transactions = await Transaction.find(filter);

  res.status(200).json({
    status: 'success',
    message: 'Berhasil mendapat transaksi',
    results: transactions.length,
    data: transactions,
  });
});

const createTransaction = asyncHandler(async (req, res) => {
  try {
    const {userId, tanggal, keterangan, nominal, akun_debit_id, akun_credit_id} = req.body;

    // Validasi field wajib
    if (!userId || !tanggal || !keterangan || !nominal || !akun_debit_id || !akun_credit_id) {
      return res.status(400).json({
        status: 'fail',
        message: 'semua field wajib diisi nominal wajib diisi',
      });
    }

    // Validasi nominal angka positif
    if (isNaN(nominal) || Number(nominal) <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Nominal harus berupa angka lebih dari 0',
      });
    }
    if (userId !== req.user._id.toString()) {
      return res.status(400).json({
        status: 'fail',
        message: 'user tidak dapat membuiat transaksi user lain',
      });
    }
    const accountDebit = await Account.findById(akun_debit_id);
    const accountCredit = await Account.findById(akun_credit_id);

    if (!accountDebit || !accountCredit || accountDebit.user_id.toString() !== userId || accountCredit.user_id.toString() !== userId) {
      return res.status(403).json({
        status: 'fail',
        message: 'Akun tidak ditemukan atau bukan milik user',
      });
    }

    // Buat transaksi
    const newTransaction = new Transaction({
      user_id: userId,
      tanggal: new Date(tanggal),
      keterangan,
      nominal,
      akun_debit_id: akun_debit_id,
      akun_credit_id: akun_credit_id,
    });

    // handler penambahan field credit atau debit dan saldo di account yang bersangkutan
    applyTransaction(accountDebit, nominal, 'debit');
    applyTransaction(accountCredit, nominal, 'credit');
    await accountDebit.save();
    await accountCredit.save();
    await newTransaction.save();

    res.status(201).json({
      status: 'success',
      message: 'Transaksi berhasil dibuat & akun diupdate',
      data: newTransaction,
    });
  } catch (error) {
    console.error('Create Transaction Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat membuat transaksi',
    });
  }
});

const updateTransaction = asyncHandler(async (req, res) => {
  try {
    const {transactionId} = req.params;
    const {tanggal, keterangan, nominal} = req.body;

    if (!tanggal || !keterangan || isNaN(nominal) || Number(nominal) <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Field tanggal, keterangan, dan nominal wajib diisi dengan benar',
      });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        status: 'fail',
        message: 'Transaksi tidak ditemukan',
      });
    }

    const oldNominal = transaction.nominal;
    const selisih = Number(nominal) - oldNominal;

    const accountId = transaction.akun_debit_id || transaction.akun_credit_id;
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({
        status: 'fail',
        message: 'Akun terkait tidak ditemukan',
      });
    }

    // Update saldo akun berdasarkan jenis transaksi dan selisih nominal
    if (transaction.akun_debit_id) {
      account.debit += selisih;
      account.saldo += account.normal_balance === 'debit' ? selisih : -selisih;
    } else {
      account.credit += selisih;
      account.saldo += account.normal_balance === 'credit' ? selisih : -selisih;
    }
    await account.save();

    // Update transaksi
    transaction.tanggal = new Date(tanggal);
    transaction.keterangan = keterangan;
    transaction.nominal = Number(nominal);
    await transaction.save();

    res.status(200).json({
      status: 'success',
      message: 'Transaksi berhasil diperbarui & saldo akun disesuaikan',
      data: transaction,
    });
  } catch (error) {
    console.error('Update Transaction Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat update transaksi',
    });
  }
});

const deleteTransaction = asyncHandler(async (req, res) => {
  try {
    const {transactionId} = req.params;

    // Cari transaksi
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        status: 'fail',
        message: 'Transaksi tidak ditemukan',
      });
    }

    // Ambil akun terkait
    const accountId = transaction.akun_debit_id || transaction.akun_credit_id;
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({
        status: 'fail',
        message: 'Akun tidak ditemukan',
      });
    }

    // Rollback nilai di akun
    if (transaction.akun_debit_id) {
      account.debit -= transaction.nominal;
      account.saldo += account.normal_balance === 'credit' ?
        transaction.nominal :
        -transaction.nominal;
    } else {
      account.credit -= transaction.nominal;
      account.saldo += account.normal_balance === 'debit' ?
        transaction.nominal :
        -transaction.nominal;
    }
    await account.save();

    // Hapus transaksi
    await transaction.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Transaksi berhasil dihapus dan akun diperbarui',
    });
  } catch (error) {
    console.error('Delete Transaction Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat menghapus transaksi',
    });
  }
});

module.exports = {getTransactionById, getTransactions, createTransaction, updateTransaction,
  deleteTransaction,
};
