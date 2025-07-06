// This middleware function handles 404 errors by sending a JSON response with an error message.
// It is typically used at the end of the middleware stack to catch any requests that do not match any defined routes.

const { CODE_RESPONSES } = require("../utils/constants");

const handlePageNotFound = (req, res, next) => {
  res.status(CODE_RESPONSES.NOT_FOUND).json({ error: "Page Not Found" });
};

module.exports = handlePageNotFound;
