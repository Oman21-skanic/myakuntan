/* eslint-disable camelcase */
const axios = require('axios');
const ML_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : process.env.ML_URL;
const asyncHandler = require('../middleware/asyncHandler');
const models = require('../models'); // mengambil models dari models/index.js
const User = models.User;
const Account = models.Account;
const Laporanlabarugi = models.Laporanlabarugi;

const historyLabaRugis = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(`${ML_URL}/history-laba-rugi`, {
      params: req.query,
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({error: err.message});
  }
});

const exportLaporan = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(`${ML_URL}/exportlaporan`, {
      params: req.query,
      responseType: 'stream',
      validateStatus: () => true,
    });
    if (response.status === 404) {
      console.log('404 running');
      return res.status(404).json({status: 'fail', message: 'Data kosong di sistem prediksi'});
    }

    if (response.status !== 200) {
      return res.status(response.status).json({status: 'fail', message: 'Gagal export dari ML'});
    }

    // Set header agar FE bisa unduh
    res.setHeader('Content-Disposition', 'attachment; filename=riwayat_prediksi.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Stream file dari Flask ke FE
    response.data.pipe(res);
  } catch (err) {
    res.status(err.response?.status || 500).json({error: err.message});
  }
});


const createLaporanLabaRugi = asyncHandler(async (req, res) => {
  const {user_id} = req.body;

  if (!user_id) {
    return res.status(400).json({error: 'user_id wajib diisi'});
  }

  console.log('Menerima request untuk user_id:', user_id);

  // Ambil bidang usaha dari koleksi User
  const user = await User.findOne({_id: user_id});
  if (!user) {
    console.log('User tidak ditemukan:', user_id);
    return res.status(404).json({error: 'User tidak ditemukan'});
  }
  const user_ID = user.user_id;

  const bidangUsaha = user.bidang_usaha;
  console.log('Bidang usaha user:', bidangUsaha);

  const tahun = new Date().getFullYear();
  const bulan = new Date().getMonth() + 1;

  // Ambil saldo akun Pendapatan
  const akunPendapatan = await Account.findOne({user_id, akun_type: 'Pendapatan'});
  const pendapatan = akunPendapatan?.saldo || 0;
  console.log('Pendapatan ditemukan:', pendapatan);

  // Ambil saldo akun Beban
  const akunBeban = await Account.findOne({user_id, akun_type: 'Beban'});
  const bebanOperasional = akunBeban?.saldo || 0;
  console.log('Beban Operasional ditemukan:', bebanOperasional);

  const pajak = 0.05 * pendapatan;
  console.log('Pajak dihitung:', pajak);

  const labaRugiLagAcc = await Laporanlabarugi.findOne({User_ID: user_ID, bulan: bulan -1});
  const labaRugiLag = labaRugiLagAcc ? labaRugiLagAcc.pendapatan - labaRugiLagAcc.Beban_Operasional - labaRugiLagAcc.pajak : 0;

  console.log('Laba Rugi Lag:', labaRugiLag);
  console.log('Pendapatan:', pendapatan, 'Tipe data:', typeof pendapatan);
  console.log('Beban Operasional:', bebanOperasional, 'Tipe data:', typeof bebanOperasional);
  console.log('Pajak:', pajak, 'Tipe data:', typeof pajak);
  console.log('User_ID:', user_ID, 'Tipe data:', typeof user_id);

  try {
    // Kirim ke Flask ML API
    console.log('Mengirim data ke Flask ML API...');
    const response = await axios.post(`${ML_URL}/predict`, {
      model: 'regresi',
      fitur: {
        User_ID: user_ID,
        Bidang_Usaha: bidangUsaha,
        Tahun: tahun,
        Bulan: bulan,
        Pendapatan: pendapatan,
        Beban_Operasional: bebanOperasional,
        Pajak: pajak,
        Laba_Rugi_Lag: labaRugiLag,
      },
    });

    console.log('Respon dari ML API diterima:', response.data);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: 'Terjadi kesalahan saat menghubungi ML API',
      message: err.message,
      stack: err.stack,
      response: err.response?.data || 'Tidak ada respon dari server',
    });
  }
});


module.exports = {historyLabaRugis, exportLaporan, createLaporanLabaRugi};
