const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const pendingOTPs = {}; // Simpan OTP sementara

// Konfigurasi transporter email (Nodemailer)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fungsi generate OTP (6 digit)
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Fungsi generate JWT token untuk validasi OTP
const generateTempToken = (email) => {
  return jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '10m'});
};

// Fungsi menyimpan OTP sementara
const storeOTP = (email, otp, purpose) => {
  pendingOTPs[email] = {otp, purpose, createdAt: Date.now()};
};

// Fungsi mendapatkan OTP yang tersimpan
const getOTP = (email) => pendingOTPs[email];

// Fungsi menghapus OTP setelah diverifikasi
const deleteOTP = (email) => {
  if (pendingOTPs[email]) {
    delete pendingOTPs[email];
    console.log(`✅ OTP untuk ${email} dihapus.`);
  }
};

// Template email OTP
const otpTemplate = (otp, purpose) => `
  <div style="
    font-family: Arial, sans-serif;
    text-align: center;
    max-width: 400px;
    margin: auto;
    background: linear-gradient(135deg, #f7e97a, #86c232);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  ">
    <h2 style="color: #333; margin-bottom: 10px;">Kode OTP Anda</h2>
    <p style="color: #555; font-size: 16px;">Gunakan kode berikut untuk ${purpose}:</p>
    <p style="
      font-size: 20px;
      font-weight: bold;
      color: #2c6e49;
      background: #fff;
      display: inline-block;
      padding: 10px 20px;
      border-radius: 5px;
      box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.1);
    ">
      ${otp}
    </p>
    <p style="color: #444; margin-top: 10px;">Berlaku selama <b>10 menit</b>.</p>
  </div>
`;

// Fungsi utama untuk mengirim OTP
const sendOTP = async (email, purpose) => {
  const otp = generateOTP();
  storeOTP(email, otp, purpose);

  const mailOptions = {
    from: `"MyAkuntan" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Kode OTP untuk ${purpose}`,
    html: otpTemplate(otp, purpose),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP "${purpose}" dikirim ke: ${email}`);

    return generateTempToken(email); // Kirim token JWT
  } catch (error) {
    console.error(`❌ Gagal mengirim OTP "${purpose}":`, error);
    deleteOTP(email);
    throw new Error(`Gagal mengirim OTP "${purpose}"`);
  }
};

// Fungsi untuk verifikasi OTP
const verifyOTP = (email, otp) => {
  const stored = getOTP(email);
  if (!stored) return {success: false, message: 'OTP tidak ditemukan.'};

  if (stored.otp !== otp) return {success: false, message: 'OTP salah.'};

  deleteOTP(email);
  return {success: true, message: `OTP valid untuk ${stored.purpose}.`};
};

module.exports = {sendOTP, verifyOTP, generateTempToken};
