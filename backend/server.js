require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRouter = require("./src/routes/user");
const handlePageNotFound = require("./src/middleware/handlePageNotFound");
const { verifyJWT } = require("./src/middleware/verifyJWT");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/user", userRouter);

// Middleware to authenticate JWT tokens
app.use(verifyJWT);

// Middleware to handle 404 errors
app.use(handlePageNotFound);

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Server is running on port ", PORT);
  }
});
