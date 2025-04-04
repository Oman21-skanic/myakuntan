const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const fs = require('fs');
const path = require('path');
const {isGuest} = require('../middleware/authMiddleware');

const clientDistPath = path.join(__dirname, '../../client/dist');

router.get('/', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

router.get('/login', isGuest, (req, res) => {
  res.sendFile(path.join(__dirname, '../../../client/src/pages/login/login.html'));
});

router.get('/login/verify', isGuest, (req, res) => {
  let htmlContent = fs.readFileSync(
      path.resolve(__dirname, '../../front-end/verify-otp.html'),
      'utf-8',
  );
  htmlContent = htmlContent.replace('{{otp}}', 'otp');
  res.send(htmlContent);
});

router.get('/register', isGuest, (req, res) => {
  const registerPage = fs.readFileSync(
      path.resolve(__dirname, '../../front-end/register.html'),
      'utf-8',
  );
  res.send(registerPage);
});

router.get('/users/reset-password', isGuest, (req, res) => {
  const resetPasswordPage = fs.readFileSync(
      path.resolve(__dirname, '../../front-end/reset-password.html'),
      'utf-8',
  );
  res.send(resetPasswordPage);
});

router.get('/users/update-password', (req, res) => {
  const updatePasswordPage = fs.readFileSync(
      path.resolve(__dirname, '../../front-end/update-password.html'),
      'utf-8',
  );
  res.send(updatePasswordPage);
});

router.get('/users/reset-password/verify', isGuest, (req, res) => {
  let htmlContent = fs.readFileSync(
      path.resolve(__dirname, '../../front-end/verify-otp.html'),
      'utf-8',
  );
  htmlContent = htmlContent.replace('{{otp}}', 'reset-password');
  res.send(htmlContent);
});


router.get('/users/reset-password/verify/update-password', isGuest, (req, res) => {
  const updatePasswordByEmail = fs.readFileSync(
      path.resolve(__dirname, '../../front-end/update-password-by-email.html'),
      'utf-8',
  );
  res.send(updatePasswordByEmail);
});


module.exports = router;
