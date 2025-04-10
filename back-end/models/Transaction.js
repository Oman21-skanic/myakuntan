const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  tanggal: {type: Date, default: Date.now, required: true},
  keterangan: {type: String, required: true}, // Keterangan transaksi
  nominal: {type: Number, required: true},
  akun_debit_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
  akun_credit_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
  jenis_transaksi: {type: String},
});

module.exports = mongoose.model('Transaction', transactionSchema);
