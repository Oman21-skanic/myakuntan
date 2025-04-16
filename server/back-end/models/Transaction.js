const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  tanggal: {type: Date, default: Date.now, required: true},
  keterangan: {type: String, required: true},
  nominal: {type: Number, required: true},
  akun_debit_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true},
  akun_credit_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true},
});

module.exports = mongoose.model('Transaction', transactionSchema);
