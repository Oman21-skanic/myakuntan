const mongoose = require('mongoose');

const LaporanSchema = new mongoose.Schema({
  User_ID: {
    type: Number,
    required: true,
  },
  Bidang_Usaha: {
    type: String,
    required: true,
  },
  Tahun: {
    type: Number,
    required: true,
  },
  Bulan: {
    type: Number,
    required: true,
  },
  Pendapatan: {
    type: Number,
    required: true,
  },
  Beban_Operasional: {
    type: Number,
    required: true,
  },
  Pajak: {
    type: Number,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  hasil_prediksi: {
    type: String,
    required: true,
  },
  nilai_prediksi: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Laporanlabarugi', LaporanSchema);
