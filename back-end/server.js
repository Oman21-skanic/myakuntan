const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const pageRoutes = require('./routes/pagesRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const {errorHandler, notFoundPath} = require('./middleware/errorMiddleware');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

require('dotenv').config();

// host dan port
const host =
  process.env.NODE_ENV === 'production' ? process.env.HOST : 'localhost';
const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

// middleware parsing body request
app.use(express.json()); // Middleware untuk parsing JSON
app.use(express.urlencoded({extended: true})); // (Opsional) Parsing form-urlencoded

// cookies
app.use(cookieParser());

// auth routes
app.use('/api/auth', authRoutes);

// route main page
app.use('/', pageRoutes);

// users routes
app.use('/api/users', usersRoutes);

// dashboard routes
app.use('/dashboard', dashboardRoutes);

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

start();

app.listen(port, host, () => {
  console.log(`server running on http://${host}:${port}`);
});
