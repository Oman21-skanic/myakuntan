const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { isGuest } = require("../middleware/authMiddleware");

router.get("/", (req, res) => {
  const landingPage = fs.readFileSync(
    path.resolve(__dirname, "../../front-end/index.html"),
    "utf-8"
  );
  res.send(landingPage);
});

router.get("/login", isGuest, (req, res) => {
  const loginPage = fs.readFileSync(
    path.resolve(__dirname, "../../front-end/login.html"),
    "utf-8"
  );
  res.send(loginPage);
});

router.get("/login/verify", isGuest, (req, res) => {
  const loginPage = fs.readFileSync(
    path.resolve(__dirname, "../../front-end/verify-otp.html"),
    "utf-8"
  );
  res.send(loginPage);
});

router.get("/register", isGuest, (req, res) => {
  const registerPage = fs.readFileSync(
    path.resolve(__dirname, "../../front-end/register.html"),
    "utf-8"
  );
  res.send(registerPage);
});

module.exports = router;
