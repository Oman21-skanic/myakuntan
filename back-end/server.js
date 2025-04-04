const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const pageRoutes = require('./routes/pagesRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const ledgerRoutes = require('./routes/ledgersRoutes');
const accountsRoutes = require('./routes/accountsRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');
const {errorHandler, notFoundPath} = require('./middleware/errorMiddleware');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

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

// Menyajikan file statis dari folder dist (hasil build frontend)
app.use(express.static(path.join(__dirname, '../../client/dist')));

app.use(express.static(path.join(__dirname, '../../client')));

// Semua permintaan lain diarahkan ke index.html dari frontend
app.use('/', pageRoutes);

// auth routes
app.use('/api/auth', authRoutes);

// route main page
// app.use('/', pageRoutes);

// users routes
app.use('/api/users', usersRoutes);

// dashboard routes
app.use('/dashboard', dashboardRoutes);

// ledger routes
app.use('/api/ledgers', ledgerRoutes);

// accounts routes
app.use('/api/accounts', accountsRoutes);

// transaction routes
app.use('/api/transactions', transactionsRoutes);

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
