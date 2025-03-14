const fs = require("fs").promises;
const path = require("path");

const renderPage = async (filePath, res, next, error) => {
  try {
    let pageContent = await fs.readFile(
      path.resolve(__dirname, filePath),
      "utf-8"
    );

    //ambil data error
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Something went wrong";

    //Mengganti placeholder file html dengan error message dan status code
    pageContent = pageContent
      .replace(/{{statusCode}}/g, statusCode)
      .replace(/{{errorMessage}}/g, errorMessage);

    res.send(pageContent);
  } catch (error) {
    res
      .status(500)
      .send("<h1>500 - Internal Server Error</h1><p>Something went wrong.</p>");
  }
};

//error 400 bad request
const badRequestHandler = (req, res, next, err) => {
  renderPage("../../front-end/bad-request.html", res, next, err);
};

//error 401 unauthorized request
const unauthorizedHandler = (req, res, next, err) => {
  renderPage("../../front-end/unauthorized-page.html", res, next, err);
};
// error 403 no have access
const forbiddenHandler = (req, res, next, err) => {
  renderPage("../../front-end/forbiddenPage.html", res, next, err);
};

// eror 404 page not found
const pageNotFoundHandler = (req, res, next, err) => {
  renderPage("../../front-end/page-not-found.html", res, next, err);
};

module.exports = {
  forbiddenHandler,
  unauthorizedHandler,
  pageNotFoundHandler,
  badRequestHandler,
};
