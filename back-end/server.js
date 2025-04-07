const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const passwordResetRoutes = require('./routes/passwordReset.routes');
const pageRoutes = require('./routes/pages.routes');
const ledgerRoutes = require('./routes/ledgers.routes');
const accountsRoutes = require('./routes/accounts.routes');
const transactionsRoutes = require('./routes/transactions.routes');
const {errorHandler, notFoundPath} = require('./middleware/errorMiddleware');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();

// host dan port
const host =
  process.env.NODE_ENV === 'production' ? process.env.HOST : 'localhost';
const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

// mengijinkan semua cors
app.use(cors());

// middleware parsing body request
app.use(express.json()); // Middleware untuk parsing JSON
app.use(express.urlencoded({extended: true})); // (Opsional) Parsing form-urlencoded

// cookies
app.use(cookieParser());

// Semua permintaan lain diarahkan ke index.html dari frontend
app.use('/', pageRoutes);

// auth routes
app.use('/api/v1/auth', authRoutes);

// users routes
app.use('/api/v1/users', usersRoutes);

// reset password routes
app.use('/api/v1/password-resets', passwordResetRoutes);

// ledger routes
app.use('/api/v1/ledgers', ledgerRoutes);

// accounts routes
app.use('/api/v1/accounts', accountsRoutes);

// transaction routes
app.use('/api/v1/transactions', transactionsRoutes);

// error path Not found
app.use(notFoundPath);
// error Handler
app.use(errorHandler);

// connect mongodb
async function start() {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log('berhasil terhubung ke database');
  } catch (error) {
    console.log(`gagal terhubung ke databse : ${error.message}`);
  }
}


app.listen(port, host, () => {
  console.log(`server running on http://${host}:${port}`);
});

module.exports = start;
