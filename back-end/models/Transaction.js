const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  ledgerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Ledger', required: true},
  accountId: {type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true},
  description: {type: String, required: true}, // Keterangan transaksi
  amount: {type: Number, required: true},
  action: {type: String, enum: ['increase', 'decrease'], required: true},
}, {timestamps: true});

module.exports = mongoose.model('Transaction', transactionSchema);
