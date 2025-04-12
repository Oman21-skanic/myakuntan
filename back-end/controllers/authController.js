// CONTROL ALL AUTENTIKASI
//
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const {sendOTP, verifyOTP} = require('../services/otpServices');

require('dotenv').config();

// FUNCTION create token jwt berdasarkan id
const signToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d',
    algorithm: 'HS256',
  });
};

// function create cookie jwt
const createResToken = (user, statusCode, res) => {
  try {
    const token = signToken(user._id);
    if (!token) {
      throw new Error('Token tidak dibuat!');
    }

    const cookieOption = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 hari
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    };

    res.cookie('jwt', token, cookieOption);
    console.log('✅ token jwt dan cookie berhasil di kirim');
  } catch (error) {
    console.error('❌ Error saat membuat token atau mengatur cookie:', error.message);
    res.status(500).json({status: 'fail', message: 'Gagal membuat token. Internal Server Error'});
  }
};

// POST register {username, email, password}
const registerUser = asyncHandler(async (req, res) => {
  const {name, email, password} = req.body;

  // validasi harus diisi
  if (!name || !email || !password) {
    return res.status(400).json({status: 'fail', message: 'Username, email, dan password wajib diisi'});
  }

  // cek apakah user sudah ada
  const userData = await User.findOne({email});


  if (userData && !userData.is_verified) {
    console.log('user ditemukan but not verified is running');
    try {
      const dataOTP = await sendOTP(email, 'registrasi account', name);
      console.log('data otp:', dataOTP);

      if (!dataOTP) {
        return res.status(500).json({status: 'fail', message: 'Gagal Internal Server Error'});
      }

      const tempToken = dataOTP.tempToken;
      return res.status(200)
          .cookie('tempToken', tempToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 60 * 1000, // 30 menit
          })
          .json({status: 'success', message: 'Kode OTP telah dikirim', data: email});
    } catch (error) {
      console.error('❌ Error saat mengirim OTP:', error.message);
      return res.status(500).json({status: 'fail', message: 'Gagal mengirim OTP', data: error.message});
    }
  }

  if (userData) {
    return res.status(400).json({status: 'fail', message: 'User sudah terdaftar'});
  }

  try {
    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // create newUser
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      createdAt,
      updatedAt,
    });
    await newUser.save();
    // membuat token jwt sementara sebagai validasi dan sendOtp
    const dataOTP = await sendOTP(email, 'registrasi account', name);

    const tempToken = dataOTP.tempToken;

    // simpan user ke database
    await newUser.save();
    res.status(200)
        .cookie('tempToken', tempToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 30 * 60 * 1000, // 10 menit
        })
        .json({status: 'success', message: 'Kode OTP telah dikirim', data: email});
  } catch (error) {
    return res.status(500).json({status: 'fail', message: 'Gagal mengirim OTP, coba lagi nanti', data: error.message});
  }
});

// POST verify-otp {otp}
const verifyUserOTP = asyncHandler(async (req, res) => {
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
    }
    console.log(`✅ User ${email} berhasil divalidasi`);
    res.clearCookie('tempToken');
    return res.status(201).json({status: 'success', message: 'Verifikasi berhasil, akun telah dibuat'});
  } catch (error) {
    console.error('❌ Error saat verifikasi OTP:', error.message);
    return res.status(500).json({status: 'fail', message: 'Terjadi kesalahan saat verifikasi OTP.'});
  }
});


// POST login user {email, password}
const loginUser = asyncHandler(async (req, res) => {
  // validasi harus diisi
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({status: 'fail', message: 'Email dan password harus diisi'});
  }
  // search user di database
  const userData = await User.findOne({email: req.body.email});
  if (!userData || !userData.is_verified) {
    return res.status(404).json({status: 'fail', message: 'User tidak ditemukan'});
  }
  // jika mendaftar dengan oauth harus login dengan cara yang sama
  if (userData.is_oauth) {
    return res.status(401).json({status: 'fail', message: 'Sepertinya anda menggunakan metode login yang salah'});
  }
  // validasi password
  const isMatch = await userData.comparePassword(req.body.password);
  if (!isMatch) {
    return res.status(400).json({status: 'fail', message: 'Password salah'});
  }
  // respon mengenbalikan jwt token jika benar
  await createResToken(userData, 200, res);
  console.log(`${userData.name} berhasil login.`);
  res.json({status: 'success', message: 'Berhasil login'});
});

// GET user dari cookie token jwt. Res json data user
const currentUser = asyncHandler(async (req, res) => {
  // mengambil data user di database tanpa password
  const user = await User.findById(req.user._id).select('_id name email');
  console.log(user,
  );

  if (user) {
    res.status(200).json({status: 'success', data: user});
  } else {
    res.status(401).json({status: 'fail', message: 'user not found'});
  }
});

// POST menghapus cookie jwt token {}
const logoutUser = asyncHandler(async (req, res) => {
  console.log('logout handler running');
  try {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0), // Hapus cookie dengan mengatur expired time ke masa lalu
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Tambahan keamanan
    });
    console.log('log out dijalankan');

    res.status(200).json({
      status: 'success',
      message: 'Logout berhasil',
    });
  } catch (error) {
    console.log(`gagal logout ${error.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Terjadi kesalahan saat logout',
      data: error.message,
    });
  }
});

// resend kode otp {email}
const sendOtpHandler = asyncHandler(async (req, res) => {
  const email = req.user.email;
  const name = req.user.name;

  const dataOTP = await sendOTP(email, 'registrasi account', name);
  console.log(dataOTP);
  if (!dataOTP) {
    return res.status(500).json({status: 'fail', message: 'Gagal Internal Server Error'});
  }
  const tempToken = dataOTP.tempToken;
  console.log(`resendotp cookie ${tempToken}`);
  console.log('berhasil');
  res.status(200)
      .cookie('tempToken', tempToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 60 * 1000, // 10 menit
      })
      .json({status: 'success', message: 'Kode OTP telah dikirim', data: email});
});

// AUTH GOOGLE
// data untuk terhubung google Oauth
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;


// GOOGLE CALLBACK handler
const googleOAuthApiHandler = asyncHandler(async (req, res) => {
  const {code} = req.body;

  if (!code) {
    return res.status(400).json({
      status: 'fail',
      message: 'Kode otorisasi tidak ditemukan',
    });
  }

  try {
    const {data} = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    // eslint-disable-next-line camelcase
    const {access_token} = data;

    const {data: profile} = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      // eslint-disable-next-line camelcase
      headers: {Authorization: `Bearer ${access_token}`},
    });

    let user = await User.findOne({email: profile.email});
    if (user && !user.is_oauth) {
      return res.status(401).json({
        status: 'fail',
        message: 'Anda menggunakan metode login yang salah',
      });
    }

    if (!user) {
      user = await User.create({
        name: profile.name,
        email: profile.email,
        is_verified: profile.verified_email,
        is_oauth: true,
        picture: profile.picture,
      });
    }
    if (!user) {
      return res.status(500).json({
        status: 'fail',
        message: 'Gagal membuat akun user baru dari OAuth',
      });
    }

    createResToken(user, 200, res);
    return res.status(200).json({
      status: 'success',
      message: 'Login dengan Google berhasil',
      data: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 'fail',
      message: err.message || 'Terjadi kesalahan',
    });
  }
});

module.exports = {
  registerUser, loginUser, createResToken, currentUser, logoutUser,
  googleOAuthApiHandler, verifyUserOTP, sendOtpHandler,
};
