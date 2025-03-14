// asyncHandler
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// token jwt berdasarkan id
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

// function create cookie token jwt
const createResToken = (user, statusCode, res) => {
  try {
    const token = signToken(user._id);

    if (!token) {
      console.error("Token tidak dibuat! Ada masalah dengan signToken.");
      return res
        .status(500)
        .json({ message: "Token tidak dibuat! Ada masalah dengan signToken." });
    }

    const cookieOption = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
    };

    res.cookie("jwt", token, cookieOption);
    user.password = undefined;

    res.status(statusCode);
  } catch (error) {
    console.error(
      "Error saat membuat token atau mengatur cookie:",
      error.message
    );
    return res.status(500).json({ message: "Gagal membuat token" });
  }
};

// POST register {username, email, password}
const registerUser = asyncHandler(async (req, res) => {
  const userData = await User.findOne({ email: req.body.email });
  if (userData) {
    return res.status(400).json({ message: "User sudah terdaftar" });
  }
  const isFirstUser = (await User.countDocuments()) === 0 ? "admin" : "user";
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: isFirstUser,
    date: new Date(),
  });
  createResToken(newUser, 201, res);
  return res.json({ message: "registrasi berhasil" });
});

//POST login user {email, password}
const loginUser = asyncHandler(async (req, res) => {
  // validasi input email
  if (!req.body.email || !req.body.password) {
    return res.status(400).json("Email dan password harus diisi");
  }

  // ambil data user
  const userData = await User.findOne({ email: req.body.email });

  if (!userData) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }
  if (userData.is_oauth) {
    return res
      .status(401)
      .json({ message: "Sepertinya anda Menggunakan metode login yang salah" });
  }
  const isMatch = await userData.comparePassword(req.body.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Password salah" });
  }

  await createResToken(userData, 201, res);
  res.json({ message: "berhasil Login" });
});

//GET user dari cookie token jwt
const currentUser = asyncHandler(async (req, res) => {
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
  res.cookie("jwt", "", { httpOnly: true, expire: new Date(Date.now) });

  res.status(200).json({
    message: "logout berhasil",
  });
};

module.exports = {
  registerUser,
  loginUser,
  createResToken,
  currentUser,
  logoutUser,
};
