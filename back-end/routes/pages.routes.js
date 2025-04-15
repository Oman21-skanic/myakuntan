const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const fs = require('fs');
const path = require('path');
const {isGuest, protectedMiddleware, isUser} = require('../middleware/authMiddleware');

function renderPage(res, relativePath, replacements = {}) {
  let htmlContent = fs.readFileSync(
      path.resolve(__dirname, `../../front-end/${relativePath}`),
      'utf-8',
  );

  // Ganti placeholder kalau ada
  Object.entries(replacements).forEach(([key, value]) => {
    htmlContent = htmlContent.replace(`{{${key}}}`, value);
  });

  res.send(htmlContent);
}


// Routes
router.get('/', (req, res) => {
  renderPage(res, 'index.html');
});

router.get('/login', isGuest, (req, res) => {
  renderPage(res, 'login.html');
});

router.get('/register', isGuest, (req, res) => {
  renderPage(res, 'register.html');
});

router.get('/dashboard', protectedMiddleware, isUser, (req, res) => {
  renderPage(res, 'dashboard.html');
});

router.get('/login/verify', isGuest, (req, res) => {
  renderPage(res, 'verify-otp.html', {otp: 'otp'});
});

router.get('/users/reset-password', isGuest, (req, res) => {
  renderPage(res, 'reset-password.html');
});

router.get('/users/update-password', (req, res) => {
  renderPage(res, 'update-password.html');
});

router.get('/users/reset-password/verify', isGuest, (req, res) => {
  renderPage(res, 'verify-otp.html', {otp: 'reset-password'});
});

router.get('/users/reset-password/verify/update-password', isGuest, (req, res) => {
  renderPage(res, 'update-password-by-email.html');
});

router.get('/auth/google/callback', (req, res) => {
  renderPage(res, 'auth-google.html');
});
router.get('/documentation/api', (req, res) => {
  const filePath = path.join(__dirname, '../../documentation/api.md');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Gagal baca file');
    }
    res.set('Content-Type', 'text/plain'); // atau text/markdown
    res.send(data);
  });
});

module.exports = router;
