// this middleware sets CORS headers to allow credentials and specific headers for requests from a frontend application.
const credentials = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // your frontend URL
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
};
module.exports = credentials;
