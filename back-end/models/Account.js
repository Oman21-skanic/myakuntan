const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  ledgerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Ledger', required: true}, // Hubungan ke buku besar
  name: {type: String, required: true}, // Nama akun (ex: Buku Modal, Buku Kas)
  category: {
    type: String,
    enum: ['Kas', 'Modal', 'Pendapatan', 'Persediaan', 'Inventaris', 'HPP', 'Utang', 'Piutang', 'Beban', 'Prive'],
    required: true,
  },
  transactions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}],
  normal_balance: {type: String, enum: ['debit', 'credit'], required: true},
  total_debit: {type: Number, default: 0}, // Total debit masuk
  total_credit: {type: Number, default: 0}, // Total kredit masuk
}, {timestamps: true}); // create && update timestamp


module.exports = mongoose.model('Account', accountSchema);
