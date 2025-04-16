const nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
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

// fungsi generate temptoken untuk disimpan di cookie
const generateTempToken = (email) => {
  return jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '30m'});
};
const generateOtpExpires = (minutes = 10) => {
  const currentTime = new Date();
  currentTime.setMinutes(currentTime.getMinutes() + minutes); // Menambahkan 10 menit ke waktu sekarang
  return currentTime.toISOString(); // Mengembalikan dalam format ISO string
};

// Template email OTP
const getHtmlTemplate = (otp, purpose, name) => {
  // ambil template dari file html
  const templatePath = path.join(__dirname, '../../front-end/otp_template.html');
  let htmlContent = fs.readFileSync(templatePath, 'utf8');
  htmlContent = htmlContent.replace('{{otp}}', otp);
  htmlContent = htmlContent.replace('{{purpose}}', purpose);
  htmlContent = htmlContent.replace('{{name}}', name);
  return htmlContent;
};


// Fungsi utama untuk mengirim OTP
const sendOTP = async (email, purpose, name) => {
  // generate otp
  const otp = generateOTP();
  const otpExpires = generateOtpExpires();
  const mailOptions = {
    from: `"MyAkuntan" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Kode OTP ${purpose}`,
    html: getHtmlTemplate(otp, purpose, name),
  };

  try {
    const user = await User.findOneAndUpdate(
        {email},
        {otp, otpExpires, updatedAt: new Date().toISOString()},
        {new: true}, // Agar mengembalikan user yang sudah diperbarui
    );

    // Cek jika user tidak ditemukan
    if (!user) {
      throw new Error('User tidak ditemukan');
    }
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP "${purpose}" dikirim ke: ${email}`);
    return {tempToken: generateTempToken(email), otp};
  } catch (error) {
    console.error(`❌ Gagal mengirim OTP "${purpose}":`, error);
    throw new Error(`Gagal mengirim OTP "${purpose}"`);
  }
};

// Fungsi untuk verifikasi OTP
const verifyOTP = async (email, otp) => {
  try {
    const user = await User.findOne({email});

    console.log('📩 Email & OTP:', email, otp);

    if (!user) {
      throw new Error('User tidak ditemukan.');
    }


    if (user.otp !== otp || Date.now() > user.otpExpires) {
      throw new Error('OTP tidak valid atau kadaluarsa.');
    }

    console.log('✅ OTP benar');

    // Update status verifikasi dan hapus OTP
    const updateUser = await User.updateOne(
        {email},
        {
          $set: {is_verified: true},
          $unset: {otp: '', otpExpires: ''},
          $currentDate: {updatedAt: true},
        },
    );

    return updateUser;
  } catch (error) {
    console.error('❌ Error verifikasi OTP:', error.message);
    throw new Error(error.message); // Lempar error ke pemanggil
  }
};


module.exports = {sendOTP, verifyOTP};

