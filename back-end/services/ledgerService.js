const Ledger = require('../models/Ledger');
const Account = require('../models/Account');
const User = require('../models/User'); // Import model User

const createLedger = async function(userId, ledgerName, ledgerType) {
  try {
    // Cari user berdasarkan ID
    const user = await User.findById(userId);
    if (!user) {
      return {status: 'fail', message: 'User tidak ditemukan'};
    }
    if (user.ledgerId) {
      return {status: 'fail', message: 'User sudah memiliki buku besar'};
    }

    // Buat buku besar baru
    const newLedger = new Ledger({
      user: userId,
      name: ledgerName,
      type: ledgerType,
      accounts: [],
      total_debit: 0,
      total_credit: 0,
    });

    // Default akun manufaktur dan dagang
    const manufakturDanDagangAccount = [
      {name: 'Buku Kas', category: 'Kas', normal_balance: 'debit'},
      {name: 'Buku Modal', category: 'Modal', normal_balance: 'credit'},
      {name: 'Buku Pendapatan', category: 'Pendapatan', normal_balance: 'credit'},
      {name: 'Buku Persediaan', category: 'Persediaan', normal_balance: 'debit'},
      {name: 'Buku Inventaris', category: 'Inventaris', normal_balance: 'debit'},
      {name: 'Buku HPP', category: 'HPP', normal_balance: 'debit'},
      {name: 'Buku Utang', category: 'Utang', normal_balance: 'credit'},
      {name: 'Buku Piutang', category: 'Piutang', normal_balance: 'debit'},
      {name: 'Buku Beban', category: 'Beban', normal_balance: 'debit'},
      {name: 'Buku Prive', category: 'Prive', normal_balance: 'debit'},
    ];

    // Default akun jasa
    const jasaAccount = [
      {name: 'Buku Kas', category: 'Kas', normal_balance: 'debit'},
      {name: 'Buku Modal', category: 'Modal', normal_balance: 'credit'},
      {name: 'Buku Pendapatan', category: 'Pendapatan', normal_balance: 'credit'},
      {name: 'Buku Inventaris', category: 'Inventaris', normal_balance: 'debit'},
      {name: 'Buku Utang', category: 'Utang', normal_balance: 'credit'},
      {name: 'Buku Piutang', category: 'Piutang', normal_balance: 'debit'},
      {name: 'Buku Beban', category: 'Beban', normal_balance: 'debit'},
      {name: 'Buku Prive', category: 'Prive', normal_balance: 'debit'},
    ];

    // Pilih akun berdasarkan tipe ledger yang dipilih user
    const selectedAccounts = ledgerType === 'jasa' ? jasaAccount : manufakturDanDagangAccount;

    // Buat akun-akun untuk ledger ini
    const createdAccounts = await Account.insertMany(
        selectedAccounts.map((acc) => ({
          ...acc,
          ledgerId: newLedger._id,
          total_debit: 0,
          total_credit: 0,
        })),
    );

    // Tambahkan akun ke ledger
    newLedger.accounts = createdAccounts.map((acc) => acc._id);
    await newLedger.save();

    // Update user ledgerId dan ledgerName
    user.ledgerId = newLedger._id;
    user.ledgerName = newLedger.name;
    await user.save();

    return {status: 'success', message: 'Buku besar berhasil dibuat!', data: {
      _id: newLedger._id,
      name: newLedger.name,
      accounts: newLedger.accounts,
      total_debit: newLedger.total_debit,
      total_credit: newLedger.total_credit,
      createdAt: newLedger.createdAt,
      updatedAt: newLedger.updatedAt,
    }};
  } catch (error) {
    return {status: 'fail', message: 'Gagal membuat buku besar', error: error.message};
  }
};

module.exports = {createLedger};
