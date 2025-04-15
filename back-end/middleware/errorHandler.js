const badRequestHandler = (err, req, res, next) => {
  res.status(400).json({
    status: 'fail',
    message: err.message || 'Bad Request',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

const unauthorizedHandler = (err, req, res, next) => {
  res.status(401).json({
    status: 'fail',
    message: err.message || 'Unauthorized',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

const forbiddenHandler = (err, req, res, next) => {
  res.status(403).json({
    status: 'fail',
    message: err.message || 'Forbidden',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

const pageNotFoundHandler = (err, req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: err.message || 'Page Not Found',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = {
  forbiddenHandler,
  unauthorizedHandler,
  pageNotFoundHandler,
  badRequestHandler,
};
