const {
  badRequestHandler,
  unauthorizedHandler,
  forbiddenHandler,
  pageNotFoundHandler,
} = require('./errorHandler');

// middleware error utama
const errorHandler = (err, req, res, next) => {
  let errStatusCode = err.statusCode || 500;
  let message = err.message;

  // Validasi Mongoose
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((e) => e.message).join(', ');
    errStatusCode = 400;
  }

  // Routing ke handler sesuai status
  if (errStatusCode === 400) return badRequestHandler(err, req, res, next);
  if (errStatusCode === 401) return unauthorizedHandler(err, req, res, next);
  if (errStatusCode === 403) return forbiddenHandler(err, req, res, next);
  if (errStatusCode === 404) return pageNotFoundHandler(err, req, res, next);

  // Default error JSON
  res.status(errStatusCode).json({
    status: 'error',
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

// Handler untuk path yang tidak ditemukan
const notFoundPath = (req, res, next) => {
  const error = new Error(`URL not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = {errorHandler, notFoundPath};
