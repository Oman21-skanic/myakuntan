const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

require("dotenv").config();

const pendingUsers = {}; // Menyimpan data user sementara

// data dan options pengirim email
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// GENERATE code OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

//FUNCTION send OTP ke email user
const sendOTP = async (email, username, password) => {
  const otp = generateOTP();

  // create user sementara
  pendingUsers[email] = {
    username,
    email,
    password,
    otp,
  };

  // detail isi email
  const mailOptions = {
    from: `"Verifikasi Akun" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verifikasi OTP MyAkuntan Account Anda",
    html: `<div style="font-family: Arial, sans-serif; text-align: center;">
  <h2 style="color: #333;">Kode OTP Anda</h2>
  <p style="font-size: 18px; font-weight: bold; color: #007bff;">${otp}</p>
  <p style="color: #666;">Berlaku selama 10 menit.</p>
</div>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅OTP berhasil dikirim ke:", email);

    // mengemabalikan token jwt ke cookie, expires 10menit
    return jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
  } catch (error) {
    // jika gagal pending user di hapus
    console.error("Gagal mengirim OTP:", error);
    delete pendingUsers[email];
    throw new Error("Gagal mengirim OTP");
  }
};

// verifikasi code otp
const verifyOTP = (email, otp) => {
  if (!pendingUsers[email]) {
    return { success: false, message: "Data tidak ditemukan." };
  }
  // validasi code OTP
  if (pendingUsers[email].otp !== otp) {
    return { success: false, message: "OTP salah." };
  }
  const userData = pendingUsers[email];

  return { success: true, message: "OTP valid.", userData };
};

// function hapus data pending user ketika sudah di add ke database
const deletePendingUser = (email) => {
  if (pendingUsers[email]) {
    delete pendingUsers[email];
    console.log(`✅ Pending user dengan email ${email} berhasil dihapus.`);
  } else {
    console.log(`❌ Pending user dengan email ${email} tidak ditemukan.`);
  }
};
module.exports = { sendOTP, verifyOTP, deletePendingUser };
