/* eslint-disable new-cap */
const express = require('express');
const {historyLabaRugis, exportLaporan, createLaporanLabaRugi} = require('../controllers/laporanController');
const {protectedMiddleware} = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protectedMiddleware, createLaporanLabaRugi);

// mengambil histroy laporan
router.get('/history', protectedMiddleware, historyLabaRugis );

// memberikan riwayat laporan dalam bentuk file excel
router.get('/export', protectedMiddleware, exportLaporan);

/* CARA PENGGUNAAN. WAJIB DENGAN QUERY PARAMETER:

1. Endpoint GET /api/v1/laporan/history
   URL ini digunakan untuk mengambil data riwayat laporan laba rugi.
   Parameter yang dapat digunakan:
   - tahun (contoh: ?tahun=2025)  --> untuk menyaring data berdasarkan tahun.
   - bulan (contoh: ?bulan=4)  --> untuk menyaring data berdasarkan bulan.
   - page (contoh: ?page=1)  --> untuk menentukan halaman data yang diambil, default adalah 1.
   - limit (contoh: ?limit=10)  --> untuk menentukan jumlah data per halaman, default adalah 10.

   Contoh URL: /api/v1/laporan/history?tahun=2025&bulan=4&page=1&limit=10

2. Endpoint GET /api/v1/laporan/export
   URL ini digunakan untuk mengekspor laporan dalam format file Excel.
   Parameter yang dapat digunakan:
   - tahun (contoh: ?tahun=2025)  --> untuk menyaring laporan berdasarkan tahun.
   - bulan (contoh: ?bulan=4)  --> untuk menyaring laporan berdasarkan bulan.
   - user_id (contoh: ?user_id=user123)  --> untuk menyaring laporan berdasarkan ID pengguna.

   Contoh URL: /api/v1/laporan/export?tahun=2025&bulan=4&user_id=user123
====================================
*/
module.exports = router;
