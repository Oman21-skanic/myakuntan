const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {sendOTP, verifyOTP} = require('../services/otpServices');


// POST reset password dengan email {email}
const resetPasswordByEmail = asyncHandler(async (req, res) => {
  try {
    const {email} = req.body;

    // Cek apakah email diisi
    if (!email) {
      return res.status(400).json({status: 'fail', message: 'Email wajib diisi'});
    }

    // Cari user berdasarkan email
    const userData = await User.findOne({email});

    // Jika user tidak ditemukan atau belum diverifikasi
    if (!userData || !userData.is_verified) {
      return res.status(404).json({status: 'fail', message: 'User tidak ditemukan atau belum diverifikasi'});
    }

    // Kirim OTP dan buat token sementara
    const dataOTP = await sendOTP(email, 'reset password', userData.name);

    if (!dataOTP) {
      throw new Error('Gagal mengirim OTP');
    }

    const tempToken = dataOTP.tempToken;

    // Set cookie tempToken
    res.status(200)
        .cookie('tempToken', tempToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 30 * 60 * 1000, // 10 menit
        })
        .json({status: 'success', message: 'Kode OTP telah dikirim', data: email});
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({status: 'fail', message: 'Terjadi kesalahan, coba lagi nanti', error: error.message});
  }
});


const verifyResetPasswordByEmail = asyncHandler(async (req, res) => {
  try {
    console.log('verifyOtp-running');
    // Ambil token jwt dari cookie
    const email = req.user?.email;
    const {otp} = req.body;
    // Validasi apakah OTP diisi
    if (!otp || typeof otp !== 'string' || otp.length !== 6 || isNaN(Number(otp))) {
      return res.status(400).json({status: 'fail', message: 'OTP harus berupa 6 digit angka.'});
    }
    console.log('📩 Email dari request:', email);
    console.log('🔢 OTP dari request:', otp);
    // Verifikasi apakah kode OTP benar
    const userData = await verifyOTP(email, otp);
    if (!userData) {
      res.clearCookie('tempToken');
      return res.status(400).json({status: 'fail', message: 'OTP salah atau sudah kadaluarsa.'});
    };
    console.log(`✅ User ${email} berhasil divalidasi`);
    res.clearCookie('tempToken');
    const resetToken = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '30m'});

    // 🔹 Set cookie resetToken
    res.cookie('resetToken', resetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 menit
    });

    return res.status(201).json({status: 'success', message: 'Verifikasi berhasil, password bisa diupdate dalam 15 menit'});
  } catch (error) {
    console.error('❌ Error saat verifikasi OTP:', error.message);
    return res.status(500).json({status: 'fail', message: error.message});
  }
});


const updatePasswordByEmail = asyncHandler( async (req, res) =>{
  try {
    const {password} = req.body;

    // 🔹 Pastikan password baru diisi
    if (!password || password.length < 6) {
      return res.status(400).json({status: 'fail', message: 'Password harus minimal 6 karakter'});
    }

    // 🔹 Ambil user dari req.user (sudah diverifikasi di middleware)
    const user = req.user;
    if (!user) {
      return res.status(404).json({status: 'fail', message: 'User tidak ditemukan'});
    }

    // 🔹 Hash password baru
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // 🔹 Simpan perubahan di database
    await user.save();

    // 🔹 Hapus cookie `resetToken`
    res.clearCookie('resetToken');

    return res.status(200).json({status: 'success', message: 'Password berhasil diperbarui'});
  } catch (error) {
    console.error('❌ Error saat update password:', error.message);
    return res.status(500).json({status: 'fail', message: 'Terjadi kesalahan saat update password'});
  }
});

module.exports = {resetPasswordByEmail,
  verifyResetPasswordByEmail, updatePasswordByEmail};
