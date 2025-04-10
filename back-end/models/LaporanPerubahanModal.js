const mongoose = require('mongoose');
const {Schema} = mongoose;

const LaporanPerubahanModalSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  tanggal: {type: Date, required: true},
  modal_awal: {type: Number, required: true},
  prive: {type: Number, required: true},
  laba_bersih: {type: Number, required: true},
  modal_akhir: {type: Number, required: true},
  keterangan: {type: String},
});

module.exports = mongoose.model('LaporanPerubahanModal', LaporanPerubahanModalSchema);
