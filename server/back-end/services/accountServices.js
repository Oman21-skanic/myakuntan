const Account = require('../models/Account');
const User = require('../models/User'); // Import model User

const createAccounts = async function(userId, bidangUsaha) {
  try {
    if (bidangUsaha !== 'Jasa' && bidangUsaha !== 'Manufaktur' && bidangUsaha !== 'Perdagangan') {
      return {status: 'fail', message: 'bidangUsaha salah atau tidak terdaftar'};
    }
    // Cari user berdasarkan ID
    const user = await User.findById(userId);
    if (!user) {
      return {status: 'fail', message: 'User tidak ditemukan'};
    }
    const isHaveAccount = await Account.find({user_id: userId});
    if (isHaveAccount.length > 0) {
      return {status: 'fail', message: 'User sudah memiliki accounts'};
    }

    // Default akun
    const defaultAccount = [
      {akun_type: 'Kas'},
      {akun_type: 'Modal', normal_balance: 'credit'},
      {akun_type: 'Pendapatan', normal_balance: 'credit'},
      {akun_type: 'Beban'},
      {akun_type: 'Hutang', normal_balance: 'credit'},
      {akun_type: 'Piutang'},
      {akun_type: 'Prive'},
    ];

    const jasaAccount = [...defaultAccount];

    const manufakturAccount = [
      ...defaultAccount,
      {akun_type: 'HPP'},
      {akun_type: 'BahanBaku'},
      {akun_type: 'BahanDalamProses'},
      {akun_type: 'BarangJadi'},
    ];

    const perdaganganAccount = [
      ...defaultAccount,
      {akun_type: 'HPP'},
      {akun_type: 'PersediaanBarangDagang'},
    ];


    // Pilih akun berdasarkan tipe ledger yang dipilih user
    const selectedAccounts =
    bidangUsaha === 'Jasa' ? jasaAccount :
    bidangUsaha === 'Manufaktur' ? manufakturAccount :
    perdaganganAccount;

    // Update bidang_usaha user
    user.bidang_usaha = bidangUsaha;
    await user.save();

    // Simpan akun ke database
    const accountsToCreate = selectedAccounts.map((account) => ({
      user_id: userId,
      akun_type: account.akun_type,
      normal_balance: account.normal_balance,
    }));

    await Account.insertMany(accountsToCreate);

    return {status: 'success', message: 'Accounts berhasil dibuat!'};
  } catch (error) {
    return {status: 'fail', message: 'Gagal membuat account', data: error.message};
  }
};

module.exports = {createAccounts};
