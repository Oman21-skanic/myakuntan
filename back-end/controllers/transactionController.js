const asyncHandler = require('../middleware/asyncHandler');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const Ledger = require('../models/Ledger');

const findAccountInLedger = async (ledgerId, category) => {
  return Account.findOne({ledgerId, category});
};

const createTransactionHandler = asyncHandler(async (req, res) => {
  const {accountId, ledgerId, amount, description, action} = req.body;

  // Validasi input
  if (!accountId || !ledgerId || !amount || !description || !action) {
    return res.status(400).json({status: 'fail', message: 'Semua field wajib diisi'});
  }
  if (action !== 'increase' && action !== 'decrease') {
    return res.status(400).json({status: 'fail', message: 'Action harus "increase" atau "decrease"'});
  }
  if (amount < 0) {
    return res.status(400).json({status: 'fail', message: 'Jumlah uang harus positif'});
  }
  if (description.length === 0) {
    return res.status(400).json({status: 'fail', message: 'Deskripsi transaksi harus diisi'});
  }
  if (description.length > 100) {
    return res.status(400).json({status: 'fail', message: 'Deskripsi transaksi harus kurang dari 100 karakter'});
  }

  const ledger = await Ledger.findById(ledgerId);
  const account = await Account.findById(accountId);

  if (!ledger || !account) {
    return res.status(404).json({status: 'fail', message: 'Akun atau ledger tidak ditemukan'});
  }

  const updateMainAccount = (acc, type) => {
    if (acc.normal_balance === 'debit') {
      acc.total_debit += type === 'increase' ? amount : -amount;
      ledger.total_debit += type === 'increase' ? amount : -amount;
    } else {
      acc.total_credit += type === 'increase' ? amount : -amount;
      ledger.total_credit += type === 'increase' ? amount : -amount;
    }
    return acc.save();
  };

  const updateCounterAccount = (acc, type) => {
    if (acc.normal_balance === 'debit') {
      acc.total_debit += type === 'increase' ? amount : -amount;
    } else {
      acc.total_credit += type === 'increase' ? amount : -amount;
    }
    return acc.save();
  };

  if (account.category === 'Kas') {
    if (action === 'increase') {
      const modalAcc = await findAccountInLedger(ledgerId, 'Modal');
      if (!modalAcc) return res.status(404).json({status: 'fail', message: 'Akun modal pada ledger ini belum ada'});

      await updateMainAccount(account, 'increase');
      await updateCounterAccount(modalAcc, 'increase');
    } else if (action === 'decrease') {
      const persediaanAcc = await findAccountInLedger(ledgerId, 'Persediaan');
      if (!persediaanAcc) return res.status(404).json({status: 'fail', message: 'Akun persediaan pada ledger ini belum ada'});

      await updateMainAccount(account, 'decrease');
      await updateCounterAccount(persediaanAcc, 'increase');
    }
  } else if (account.category === 'Modal') {
    if (action === 'increase') {
      const kasAcc = await findAccountInLedger(ledgerId, 'Kas');
      if (!kasAcc) return res.status(404).json({status: 'fail', message: 'Akun kas pada ledger ini belum ada'});

      await updateMainAccount(account, 'increase');
      await updateCounterAccount(kasAcc, 'increase');
    }
  } else if (account.category === 'Persediaan') {
    const kasAcc = await findAccountInLedger(ledgerId, 'Kas');
    if (!kasAcc) return res.status(404).json({status: 'fail', message: 'Akun kas pada ledger ini belum ada'});

    if (action === 'increase') {
      await updateMainAccount(account, 'increase');
      await updateCounterAccount(kasAcc, 'decrease');
    } else {
      await updateMainAccount(account, 'decrease');
      await updateCounterAccount(kasAcc, 'increase');
    }
  } else if (
    ['Pendapatan', 'Inventaris', 'HPP', 'Utang', 'Piutang', 'Beban', 'Prive'].includes(account.category)
  ) {
    if (action === 'increase' && account.normal_balance === 'debit') {
      account.total_debit += amount;
      ledger.total_debit += amount;
      await account.save();
    } else if (action === 'increase' && account.normal_balance === 'credit') {
      account.total_credit += amount;
      ledger.total_credit += amount;
      await account.save();
    } else if (action === 'decrease' && account.normal_balance === 'debit') {
      account.total_debit -= amount;
      ledger.total_debit -= amount;
      await account.save();
    } else if (action === 'decrease' && account.normal_balance === 'credit') {
      account.total_credit -= amount;
      ledger.total_credit -= amount;
      await account.save();
    }
  } else {
    return res.status(400).json({status: 'fail', message: 'Kategori akun tidak valid'});
  }

  await ledger.save();

  const transaction = await Transaction.create({
    ledgerId,
    accountId,
    description,
    amount,
    action,
  });

  res.status(201).json({status: 'success', message: 'transaksi berhasil dibuat', data: transaction});
});


const getTransactionHandler = asyncHandler( async (req, res) => {
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


// GET ALL TRANSACTIONS BY LEDGER ID
const getAllTransactionsByLedgerHandler = asyncHandler(async (req, res) => {
  try {
    const {ledgerId} = req.params;
    if (!ledgerId) {
      return res.status(400).json({status: 'fail', message: 'Invalid ledger ID'});
    }
    const transactions = await Transaction.find({ledgerId});
    res.json({status: 'success', message: 'Berhasil mendapat data semua transaksi', data: transactions});
  } catch (error) {
    console.error(error);
    res.status(500).json({status: 'fail', message: 'Terjadi kesalahan server', error: error.message});
  }
});

const getTransactionsByAccountHandler = asyncHandler( async (req, res) => {
  try {
    const {accountId} = req.params;
    if (!accountId) {
      return res.status(400).json({status: 'fail', message: 'Invalid ledger ID'});
    }
    const transactions = await Transaction.find({accountId});
    res.json({status: 'success', message: 'Berhasil mendapat data semua transaksi', data: transactions});
  } catch (error) {
    console.error(error);
    res.status(500).json({status: 'fail', message: 'Terjadi kesalahan server', error: error.message});
  }
});

const updateTransactionHandler = asyncHandler(async (req, res) => {
  const {transactionId} = req.params;
  const {amount, description, action} = req.body;
  if (transactionId === ':transactionId') {
    return res.status(400).json({
      status: 'fail',
      message: 'ID transaksi tidak valid. Pastikan Anda mengganti ":transactionId" dengan ID asli.',
    });
  }
  if (!transactionId || !amount || !description || !action) {
    return res.status(400).json({status: 'fail', message: 'Semua field wajib diisi'});
  }
  if (action !== 'increase' && action !== 'decrease') {
    return res.status(400).json({status: 'fail', message: 'Action harus "increase" atau "decrease"'});
  }
  if (amount < 0) {
    return res.status(400).json({status: 'fail', message: 'Jumlah uang harus positif'});
  }
  if (description.length === 0) {
    return res.status(400).json({status: 'fail', message: 'Deskripsi transaksi harus diisi'});
  }
  if (description.length > 100) {
    return res.status(400).json({status: 'fail', message: 'Deskripsi transaksi harus kurang dari 100 karakter'});
  }

  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    return res.status(404).json({status: 'fail', message: 'Transaksi tidak ditemukan'});
  }

  const mainAccount = await Account.findById(transaction.accountId);
  const ledger = await Ledger.findById(transaction.ledgerId);
  if (!mainAccount || !ledger) {
    return res.status(404).json({status: 'fail', message: 'Akun atau ledger tidak ditemukan'});
  }

  const findAccountInLedger = async (ledgerId, category) => {
    return Account.findOne({ledgerId, category});
  };

  const rollbackAccount = async (acc, amount, action) => {
    if (acc.normal_balance === 'debit') {
      acc.total_debit += action === 'increase' ? -amount : amount;
      ledger.total_debit += action === 'increase' ? -amount : amount;
    } else {
      acc.total_credit += action === 'increase' ? -amount : amount;
      ledger.total_credit += action === 'increase' ? -amount : amount;
    }
    await acc.save();
  };

  const rollbackCounterAccount = async (mainCategory, oldAction) => {
    if (mainCategory === 'Kas') {
      const counter = oldAction === 'increase' ? 'Modal' : 'Persediaan';
      const acc = await findAccountInLedger(ledger.id, counter);
      if (acc) {
        if (acc.normal_balance === 'debit') {
          acc.total_debit -= amount;
        } else {
          acc.total_credit -= amount;
        }
        await acc.save();
      }
    } else if (mainCategory === 'Modal') {
      const kas = await findAccountInLedger(ledger.id, 'Kas');
      if (kas) {
        if (kas.normal_balance === 'debit') {
          kas.total_debit -= amount;
        } else {
          kas.total_credit -= amount;
        }
        await kas.save();
      }
    } else if (mainCategory === 'Persediaan') {
      const kas = await findAccountInLedger(ledger.id, 'Kas');
      if (kas) {
        if (kas.normal_balance === 'debit') {
          kas.total_debit += oldAction === 'increase' ? amount : -amount;
        } else {
          kas.total_credit += oldAction === 'increase' ? amount : -amount;
        }
        await kas.save();
      }
    }
  };

  // ROLLBACK TRANSAKSI LAMA
  await rollbackAccount(mainAccount, transaction.amount, transaction.action);
  await rollbackCounterAccount(mainAccount.category, transaction.action);

  // Proses TRANSAKSI BARU
  const updateMainAccount = (acc, type) => {
    if (acc.normal_balance === 'debit') {
      acc.total_debit += type === 'increase' ? amount : -amount;
      ledger.total_debit += type === 'increase' ? amount : -amount;
    } else {
      acc.total_credit += type === 'increase' ? amount : -amount;
      ledger.total_credit += type === 'increase' ? amount : -amount;
    }
    return acc.save();
  };

  const updateCounterAccount = async (mainCategory, type) => {
    if (mainCategory === 'Kas') {
      const counter = type === 'increase' ? 'Modal' : 'Persediaan';
      const acc = await findAccountInLedger(ledger.id, counter);
      if (!acc) return;
      if (acc.normal_balance === 'debit') {
        acc.total_debit += amount;
      } else {
        acc.total_credit += amount;
      }
      await acc.save();
    } else if (mainCategory === 'Modal') {
      const kas = await findAccountInLedger(ledger.id, 'Kas');
      if (kas) {
        if (kas.normal_balance === 'debit') {
          kas.total_debit += amount;
        } else {
          kas.total_credit += amount;
        }
        await kas.save();
      }
    } else if (mainCategory === 'Persediaan') {
      const kas = await findAccountInLedger(ledger.id, 'Kas');
      if (kas) {
        if (kas.normal_balance === 'debit') {
          kas.total_debit += type === 'increase' ? -amount : amount;
        } else {
          kas.total_credit += type === 'increase' ? -amount : amount;
        }
        await kas.save();
      }
    }
  };

  if (['Kas', 'Modal', 'Persediaan'].includes(mainAccount.category)) {
    await updateMainAccount(mainAccount, action);
    await updateCounterAccount(mainAccount.category, action);
  } else {
    // Kategori akun spesial (langsung 1 akun)
    if (action === 'increase') {
      if (mainAccount.normal_balance === 'debit') {
        mainAccount.total_debit += amount;
        ledger.total_debit += amount;
      } else {
        mainAccount.total_credit += amount;
        ledger.total_credit += amount;
      }
    } else {
      if (mainAccount.normal_balance === 'debit') {
        mainAccount.total_debit -= amount;
        ledger.total_debit -= amount;
      } else {
        mainAccount.total_credit -= amount;
        ledger.total_credit -= amount;
      }
    }
    await mainAccount.save();
  }

  await ledger.save();

  // Simpan data transaksi baru
  transaction.amount = amount;
  transaction.description = description;
  transaction.action = action;
  await transaction.save();

  res.status(200).json({
    status: 'success',
    message: 'Transaksi berhasil diperbarui',
    data: transaction,
  });
});


const deleteTransactionHandler = asyncHandler(async (req, res) => {
  const {transactionId} = req.params;

  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    return res.status(404).json({status: 'fail', message: 'Transaksi tidak ditemukan'});
  }

  const ledger = await Ledger.findById(transaction.ledgerId);
  const account = await Account.findById(transaction.accountId);
  if (!ledger || !account) {
    return res.status(404).json({status: 'fail', message: 'Data akun atau ledger tidak valid'});
  }

  const findAccountInLedger = async (ledgerId, category) => {
    return Account.findOne({ledgerId, category});
  };

  const rollbackAccount = (acc, amount, action) => {
    if (acc.normal_balance === 'debit') {
      acc.total_debit += action === 'increase' ? -amount : amount;
      ledger.total_debit += action === 'increase' ? -amount : amount;
    } else {
      acc.total_credit += action === 'increase' ? -amount : amount;
      ledger.total_credit += action === 'increase' ? -amount : amount;
    }
    return acc.save();
  };

  // Rollback akun utama
  await rollbackAccount(account, transaction.amount, transaction.action);

  // Rollback akun counter
  if (account.category === 'Kas') {
    const counter = transaction.action === 'increase' ?
      await findAccountInLedger(transaction.ledgerId, 'Modal') :
      await findAccountInLedger(transaction.ledgerId, 'Persediaan');
    if (counter) await rollbackAccount(counter, transaction.amount, 'increase');
  } else if (account.category === 'Modal') {
    const counter = await findAccountInLedger(transaction.ledgerId, 'Kas');
    if (counter) await rollbackAccount(counter, transaction.amount, 'increase');
  } else if (account.category === 'Persediaan') {
    const counter = await findAccountInLedger(transaction.ledgerId, 'Kas');
    if (counter) await rollbackAccount(counter, transaction.amount, transaction.action === 'increase' ? 'decrease' : 'increase');
  }

  await ledger.save();
  await transaction.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Transaksi berhasil dihapus',
  });
});

module.exports = {createTransactionHandler, getTransactionHandler, getAllTransactionsByLedgerHandler,
  getTransactionsByAccountHandler, updateTransactionHandler, deleteTransactionHandler};
