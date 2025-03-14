const {
  pageNotFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
  forbiddenHandler,
} = require("../controllers/errorHandler");

// middleware error
const errorHandler = (err, req, res, next) => {
  let errStatusCode = err.statusCode;
  let message = err.message;

  // Validasi mongoose
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    errStatusCode = 400;
  }
  //jika error code undefined
  if (!errStatusCode) {
    console.log(`error statuscode: ${errStatusCode}`);
    res.redirect("/");
    return;
  }
  // Handling specific HTTP error status
  if (errStatusCode === 400) {
    return badRequestHandler(req, res, next, err); // Bad Request handler
  }

  if (errStatusCode === 401) {
    return unauthorizedHandler(req, res, next, err); // Unauthorized handler
  }

  if (errStatusCode === 403) {
    return forbiddenHandler(req, res, next, err); // Forbidden handler
  }

  if (errStatusCode === 404) {
    return pageNotFoundHandler(req, res, next, err); // Page Not Found handler
  }

  res.status(errStatusCode);
  res.json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

// Error path not found
const notFoundPath = (req, res, next) => {
  const error = new Error(`url not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFoundPath };
