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
  const {userId, accountId, page = 1, limit = 10} = req.query;
  const currentUser = req.user;
  const filter = {};

  // === Validasi ID ===
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

  // === Filter by userId ===
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

  // === Filter by accountId ===
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

    filter.$or = [
      {akun_debit_id: accountId},
      {akun_credit_id: accountId},
    ];
  }

  // === Admin-only jika tanpa userId/accountId ===
  if (!userId && !accountId && currentUser.role !== 'admin') {
    return res.status(403).json({
      status: 'fail',
      message: 'Only admin can access all transactions',
    });
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Transaction.countDocuments(filter);
  const transactions = await Transaction.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({createdAt: -1}); // Optional: urut dari yang terbaru

  res.status(200).json({
    status: 'success',
    message: 'Berhasil mendapat transaksi',
    results: transactions.length,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
    data: transactions,
  });
});


const createTransaction = asyncHandler(async (req, res) => {
  try {
    const {userId, tanggal, keterangan, nominal, akun_debit_id, akun_credit_id} = req.body;
    const parsedDate = new Date(tanggal);

    // Validasi field wajib
    if (!userId || !tanggal || !keterangan || !nominal || !akun_debit_id || !akun_credit_id) {
      return res.status(400).json({
        status: 'fail',
        message: 'semua field wajib diisi nominal wajib diisi',
      });
    }
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        status: 'fail',
        message: 'Tanggal tidak valid',
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
    const nominalNumber = Number(nominal);

    // Buat transaksi
    const newTransaction = new Transaction({
      user_id: userId,
      tanggal: parsedDate,
      keterangan,
      nominal: nominalNumber,
      akun_debit_id: akun_debit_id,
      akun_credit_id: akun_credit_id,
    });

    // handler penambahan field credit atau debit dan saldo di account yang bersangkutan
    applyTransaction(accountDebit, nominalNumber, 'debit');
    applyTransaction(accountCredit, nominalNumber, 'credit');
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
    const parsedDate = new Date(tanggal);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        status: 'fail',
        message: 'Tanggal tidak valid',
      });
    }


    const oldNominal = transaction.nominal;
    const nominalNumber = Number(nominal);

    const accountDebit = await Account.findById(transaction.akun_debit_id);
    const accountCredit = await Account.findById(transaction.akun_credit_id);

    if (!accountDebit || !accountCredit) {
      return res.status(404).json({
        status: 'fail',
        message: 'Akun terkait tidak ditemukan',
      });
    }
    // rollback transaction lama
    applyTransaction(accountDebit, -oldNominal, 'debit');
    applyTransaction(accountCredit, -oldNominal, 'credit');

    // Update saldo akun berdasarkan jenis transaksi dan selisih nominal
    applyTransaction(accountDebit, nominalNumber, 'debit');
    applyTransaction(accountCredit, nominalNumber, 'credit');
    await accountDebit.save();
    await accountCredit.save();

    // Update transaksi
    transaction.tanggal = parsedDate;
    transaction.keterangan = keterangan;
    transaction.nominal = nominalNumber;
    await transaction.save();

    res.status(200).json({
      status: 'success',
      message: 'Transaksi berhasil diperbarui & akun diperbarui',
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
    const oldNominal = transaction.nominal;

    // ambil akun terkait
    const accountDebit = await Account.findById(transaction.akun_debit_id);
    const accountCredit = await Account.findById(transaction.akun_credit_id);

    if (!accountDebit || !accountCredit) {
      return res.status(404).json({
        status: 'fail',
        message: 'Akun terkait tidak ditemukan',
      });
    }
    // rollback akun terkait
    applyTransaction(accountDebit, -oldNominal, 'debit');
    applyTransaction(accountCredit, -oldNominal, 'credit');
    await accountDebit.save();
    await accountCredit.save();

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
