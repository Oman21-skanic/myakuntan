const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  name: {type: String, required: true},
  accounts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Account'}],
  total_debit: {type: Number, default: 0}, // Total debit untuk semua akun dalam buku besar
  total_credit: {type: Number, default: 0}, // Total kredit untuk semua akun dalam buku besar
}, {timestamps: true}); // create & update timestamp

module.exports = mongoose.model('Ledger', ledgerSchema);
