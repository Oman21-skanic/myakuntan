const asyncHandler = require('../middleware/asyncHandler');
const {createLedger} = require('../services/ledgerService');
const Ledger = require('../models/Ledger');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');

// Route untuk membuat buku besar
const createLedgerHandler = asyncHandler( async (req, res) => {
  const {userId, ledgerName, ledgerType} = req.body;
  if (!userId || !ledgerName || !ledgerType) {
    return res.status(400).json({status: 'fail', message: 'field harus di isi'});
  }

  if (!['dagang', 'jasa'].includes(ledgerType)) {
    return res.status(400).json({status: 'fail', message: 'Tipe buku besar tidak valid'});
  }

  const result = await createLedger(userId, ledgerName, ledgerType);
  if (result.status === 'success') {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
});


// Route untuk mendapatkan buku besar bersarakan id
const getLedgerHandler = asyncHandler( async (req, res) => {
  const {ledgerId} = req.params;
  // Pastikan ledgerId valid
  if (!mongoose.Types.ObjectId.isValid(ledgerId)) {
    return res.status(400).json({status: 'error', message: 'ID buku besar tidak valid'});
  }
  if (!ledgerId) {
    return res.status(400).json({status: 'fail', message: 'ID buku besar harus diisi'});
  }
  const result = await Ledger.findById(ledgerId)
      .populate('accounts', 'name category _id total_debit total_credit')
      .populate('user', 'name _id');
  if (result) {
    res.json({status: 'success', message: 'Buku besar ditemukan', data: result});
  } else {
    res.status(404).json({status: 'fail', message: 'Buku besar tidak ditemukan', data: result});
  }
});

const updateLedgerHandler = asyncHandler(async (req, res) => {
  try {
    const {ledgerId} = req.params;
    const {name} = req.body;
    const userId = req.user._id;
    if (!ledgerId ||!name) {
      return res.status(400).json({status: 'fail', message: 'ID buku besar dan nama harus diisi'});
    }
    // Pastikan ledgerId valid
    if (!mongoose.Types.ObjectId.isValid(ledgerId)) {
      return res.status(400).json({status: 'error', message: 'ID buku besar tidak valid'});
    }
    const findLedger = await Ledger.findById(ledgerId);
    if (!findLedger) {
      return res.status(404).json({status: 'fail', message: 'Buku besar tidak ditemukan'});
    }
    const ledger = Ledger.findOne({_id: ledgerId, user: userId});
    if (!ledger) {
      return res.status(404).json({status: 'fail', message: 'Anda tidak memiliki akses untuk mengubah buku besar ini'});
    }
    ledger.name = name;
    await ledger.save();
    res.status(200).json({status: 'success', message: 'Nama buku besar berhasil diubah'});
  } catch (error) {
    res.status(500).json({status: 'error', message: 'Gagal mengubah nama buku besar', error: error.message});
  }
});

const deleteLedgerHandler = asyncHandler( async (req, res) => {
  try {
    const {ledgerId} = req.params;
    const userId = req.user._id;
    if (!ledgerId) {
      return res.status(400).json({status: 'fail', message: 'ID buku besar harus diisi'});
    }
    // Pastikan ledgerId valid
    if (!mongoose.Types.ObjectId.isValid(ledgerId)) {
      return res.status(400).json({status: 'error', message: 'ID buku besar tidak valid'});
    }
    const findLedger = await Ledger.findById(ledgerId);
    if (!findLedger) {
      return res.status(404).json({status: 'fail', message: 'Buku besar tidak ditemukan'});
    }
    const ledger = await Ledger.findOne({_id: ledgerId, user: userId});
    if (!ledger) {
      return res.status(404).json({status: 'fail', message: 'Anda tidak memiliki akses untuk menghapus buku besar ini'});
    }

    // hapus semua account yang terkait
    await Account.deleteMany({ledger: ledgerId});

    // hapus semua transaksi yang terkait
    await Transaction.deleteMany({ledger: ledgerId});

    // hapus buku besar
    await Ledger.findByIdAndDelete(ledgerId);

    // hapus relasi user ke buku besar
    await User.updateOne({ledgerId: ledgerId}, {$unset: {ledgerId: '', ledgerName: ''}});

    res.status(200).json({status: 'success', message: 'Buku besar berhasil dihapus'});
  } catch (error) {
    res.status(500).json({status: 'error', message: 'Gagal menghapus buku besar', error: error.message});
  }
});
module.exports = {createLedgerHandler, getLedgerHandler, deleteLedgerHandler, updateLedgerHandler};
