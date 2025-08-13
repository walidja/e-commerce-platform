require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRouter = require("./src/routes/user");
const authRouter = require("./src/routes/auth");
const categoryRouter = require("./src/routes/category");
const shopRouter = require("./src/routes/shop"); // Uncomment if you have a shop route

const handlePageNotFound = require("./src/middleware/handlePageNotFound");
const { verifyJWT } = require("./src/middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./src/middleware/credentials");
const https = require("https"); // Import the HTTPS module
const fs = require("fs"); // Import the File System module
const path = require("path"); // Import the Path module for resolving file paths
const productsRouter = require("./src/routes/products");
const { createDirectoryIfNotExists } = require("./src/utils/fileUtils");

const app = express();
const PORT = process.env.PORT;

app.use(credentials);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Define the path to your uploads directory
const uploadsDir = path.join(__dirname, "uploads");
// 3. Ensure the uploads directory exists
createDirectoryIfNotExists(uploadsDir);

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(uploadsDir));

app.use("/user", userRouter);
app.use("/categories", categoryRouter);
app.use("/products", productsRouter);

// Middleware to authenticate JWT tokens
// app.use(verifyJWT);

app.use("/auth", verifyJWT, authRouter);
app.use("/shop", verifyJWT, shopRouter);

// Middleware to handle 404 errors
app.use(handlePageNotFound);

// --- Certificate loading ---
// Adjust paths if your certs are in a different folder
const privateKeyPath = path.join(__dirname, "localhost+2-key.pem"); // Or whatever mkcert named it
const certificatePath = path.join(__dirname, "localhost+2.pem"); // Or whatever mkcert named it

const options = {
  key: fs.readFileSync(privateKeyPath, "utf8"),
  cert: fs.readFileSync(certificatePath, "utf8"),
};

// --- Create and start the HTTPS server ---
const httpsServer = https.createServer(options, app);

httpsServer.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`HTTPS Server running on https://localhost:${PORT}`);
  }
});
