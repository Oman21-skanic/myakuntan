const fs = require('fs').promises;
const path = require('path');

const renderPage = async (filePath, res, next, error) => {
  try {
    let pageContent = await fs.readFile(
        path.resolve(__dirname, filePath),
        'utf-8',
    );

    // ambil data error
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'Something went wrong';

    // Mengganti placeholder file html dengan error message dan status code
    pageContent = pageContent
        .replace(/{{statusCode}}/g, statusCode)
        .replace(/{{errorMessage}}/g, errorMessage);

    res.status(statusCode).send(pageContent);
  } catch (error) {
    if (res.headersSent) {
      return; // ✅ Kalau header sudah dikirim, jangan kirim respons lagi
    }
    res.status(500).json({status: 'fail', message: error.message});
  }
};

// error 400 bad request
const badRequestHandler = (err, req, res, next) => {
  renderPage('../../front-end/bad-request.html', res, next, err);
};

// error 401 unauthorized request
const unauthorizedHandler = (err, req, res, next) => {
  renderPage('../../front-end/unauthorized-page.html', res, next, err);
};
// error 403 no have access
const forbiddenHandler = (err, req, res, next) => {
  renderPage('../../front-end/forbiddenPage.html', res, next, err);
};

// eror 404 page not found
const pageNotFoundHandler = (err, req, res, next) => {
  renderPage('../../front-end/page-not-found.html', res, next, err);
};

module.exports = {
  forbiddenHandler,
  unauthorizedHandler,
  pageNotFoundHandler,
  badRequestHandler,
};
