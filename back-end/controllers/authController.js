//CONTROL ALL AUTENTIKASI
//
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const {
  sendOTP,
  verifyOTP,
  deletePendingUser,
} = require("../services/otpServices");

require("dotenv").config();

// FUNCTION create token jwt berdasarkan id
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

// function create cookie jwt
const createResToken = (user, statusCode, res) => {
  try {
    const token = signToken(user._id);
    if (!token) {
      throw new Error("Token tidak dibuat!");
    }

    const cookieOption = {
      expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 hari
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    res.cookie("jwt", token, cookieOption);
    user.password = undefined;
    console.log("✅ token jwt dan cookie berhasil di kirim");
  } catch (error) {
    console.error(
      "❌ Error saat membuat token atau mengatur cookie:",
      error.message
    );
    res.status(500).json({ message: "Gagal membuat token" });
  }
};

// POST register {username, email, password}
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // validasi harus diisi
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, dan password wajib diisi" });
  }

  // cek apakah user sudah ada
  const userData = await User.findOne({ email });
  if (userData) {
    return res.status(400).json({ message: "User sudah terdaftar" });
  }

  try {
    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // membuat token jwt sementara sebagai validasi apakah orang yang sama
    // mengirim code otp ke email user
    const tempToken = await sendOTP(email, name, hashedPassword);
    return res
      .status(200)
      .cookie("tempToken", tempToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 10 * 60 * 1000, // 10 menit
      })
      .json({ message: "Kode OTP telah dikirim ke email Anda" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Gagal mengirim OTP, coba lagi nanti" });
  }
});

// POST verify-otp {otp}
const verifyUserOTP = asyncHandler(async (req, res) => {
  // Ambil token jwt dari cookie
  const tempToken = req.cookies.tempToken;
  const otp = req.body.otp;

  // validasi apakah otp diisi dan token valid
  if (!otp) {
    return res.status(400).json({ message: "OTP tidak valid." });
  }
  if (!tempToken) {
    return res.status(400).json({ message: "TOKEN INVALID. register ulang!" });
  }

  // ambil email dari token jwt
  const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
  const email = decoded.email;

  //verifikasi apakah kode otp benar
  const verificationResult = verifyOTP(email, otp);
  if (!verificationResult.success) {
    return res.status(400).json({ message: verificationResult.message });
  }

  // Ambil data user dari pending user dan add ke database
  const { username, password } = verificationResult.userData;

  const isFirstUser = (await User.countDocuments()) === 0 ? "admin" : "user";

  const newUser = await User.create({
    name: username,
    email,
    password,
    role: isFirstUser,
    isVerified: true,
  });

  // hapus user dari pending users
  deletePendingUser(email);

  console.log(`user ditambahkan: ${newUser.name}`);
  //kirim cookie jwt ke cookie dan kirim respon berhasil
  createResToken(newUser, 201, res);
  return res.json({ message: "Verifikasi berhasil, akun telah dibuat" });
});

//POST login user {email, password}
const loginUser = asyncHandler(async (req, res) => {
  // validasi harus diisi
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "Email dan password harus diisi" });
  }

  // search user di database
  const userData = await User.findOne({ email: req.body.email });

  if (!userData) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }

  // jika mendaftar dengan oauth harus login dengan cara yang sama
  if (userData.is_oauth) {
    return res
      .status(401)
      .json({ message: "Sepertinya anda menggunakan metode login yang salah" });
  }

  // validasi password
  const isMatch = await userData.comparePassword(req.body.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Password salah" });
  }

  // respon mengenbalikan jwt token jika benar
  await createResToken(userData, 200, res);

  console.log(`${userData.name} berhasil login.`);
  res.json({ message: "Berhasil login" });
});

//GET user dari cookie token jwt. Res json data user
const currentUser = asyncHandler(async (req, res) => {
  // mengambil data user di database tanpa password
  const user = await User.findById(req.user.id).select("-password");
  if (user) {
    res.status(200).json({
      user,
    });
  } else {
    res.status(401).json({ message: "user not found" });
  }
});

//POST menghapus cookie jwt token {}
const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Set ke waktu yang sudah lewat untuk menghapus cookie
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    message: "Logout berhasil",
  });
};

//AUTH GOOGLE
//data untuk terhubung google Oauth
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

//REDIRECT insialisasi login
const googleLogin = (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
};

// callback Handler
const googleCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { access_token } = data;

    // Get user profile from Google
    const { data: profile } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    // cari user di database
    let user = await User.findOne({ email: profile.email });
    if (user && !user.is_oauth) {
      const error = new Error(
        "sepertinya anda menggunakan metode login yang salah"
      );
      error.statusCode = 401;
      throw error;
    }

    // jika tidak ada add user to database
    if (!user) {
      user = await User.create({
        name: profile.name,
        email: profile.email,
        isVerified: profile.verified_email,
        is_oauth: true,
        picture: profile.picture,
      });
    }

    createResToken(user, 201, res);
    // jika berhasil redirect ke home page
    res.redirect("/");
  } catch (error) {
    // tangkap error
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
});

module.exports = {
  registerUser,
  loginUser,
  createResToken,
  currentUser,
  logoutUser,
  googleLogin,
  googleCallback,
  verifyUserOTP,
};
