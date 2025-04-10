const mongoose = require('mongoose');
const {Schema} = mongoose;

const LaporanNeracaSaldoSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  akun_id: {type: Schema.Types.ObjectId, ref: 'Account', required: true},
  tanggal: {type: Date, required: true},
  debit: {type: Number, required: true},
  kredit: {type: Number, required: true},
});

module.exports = mongoose.model('LaporanNeracaSaldo', LaporanNeracaSaldoSchema);
