const mongoose = require('mongoose');
const {Schema} = mongoose;

const LaporanNeracaSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  tanggal: {type: Date, required: true},
  total_aktiva: {type: Number, required: true},
  total_pasiva: {type: Number, required: true},
  keterangan: {type: String},
});

module.exports = mongoose.model('LaporanNeraca', LaporanNeracaSchema);
