const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  akun_type: {
    type: String,
    enum: ['Kas', 'Modal', 'Pendapatan', 'Beban', 'Hutang', 'Piutang', 'Prive',
      'HPP', 'BahanBaku', 'BahanDalamProses', 'BarangJadi', 'PersediaanBarangDagang'],
    required: true,
  },
  debit: {type: Number, default: 0},
  credit: {type: Number, default: 0},
  saldo: {type: Number, default: 0},
  normal_balance: {type: String, enum: ['debit', 'credit'], required: true},

}, {timestamps: true}); // create && update timestamp


module.exports = mongoose.model('Account', accountSchema);
