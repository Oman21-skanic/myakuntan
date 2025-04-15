const mongoose = require('mongoose');
const {Schema} = mongoose;

const LaporanLabaRugiSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  tanggal: {type: Date, required: true},
  total_pendapatan: {type: Number, required: true},
  total_beban: {type: Number, required: true},
  laba_bersih: {type: Number, required: true},
  keterangan: {type: String},
});

module.exports = mongoose.model('LaporanLabaRugi', LaporanLabaRugiSchema);
