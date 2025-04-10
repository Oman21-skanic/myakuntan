const {
  badRequestHandler,
  unauthorizedHandler,
  forbiddenHandler,
  pageNotFoundHandler,
} = require('./errorHandler');

// middleware error
const errorHandler = (err, req, res, next) => {
  let errStatusCode = err.statusCode ? err.statusCode : 500;
  let message = err.message;

  // Validasi mongoose
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
        .map((item) => item.message)
        .join(',');
    errStatusCode = 400;
  }

  // Handling specific HTTP error status
  if (errStatusCode === 400) {
    return badRequestHandler(err, req, res, next); // Bad Request handler
  }

  if (errStatusCode === 401) {
    return unauthorizedHandler(err, req, res, next); // Unauthorized handler
  }

  if (errStatusCode === 403) {
    return forbiddenHandler(err, req, res, next); // Forbidden handler
  }

  if (errStatusCode === 404) {
    return pageNotFoundHandler(err, req, res, next); // Page Not Found handler
  }

  res.status(errStatusCode);
  res.json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// Error path not found
const notFoundPath = (req, res, next) => {
  const error = new Error(`url not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = {errorHandler, notFoundPath};
