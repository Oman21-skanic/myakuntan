const axios = require("axios");
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");
const { createResToken } = require("./authController");
const { Error } = require("mongoose");

require("dotenv").config();

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
    // cari user didatabe
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
    res.redirect("/");
  } catch (error) {
    // periksa apkah error memiliki status code
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
});

module.exports = { googleLogin, googleCallback };
