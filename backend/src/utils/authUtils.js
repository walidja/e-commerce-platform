// import statements
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { PrismaClient } = require("../generated/prisma/client");
const {
  TOKEN_LENGTH,
  SALT,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION,
  REMEMBER_ME_TOKEN_SECRET,
  REMEMBER_ME_TOKEN_EXPIRATION,
  COOKIE_EXPIRATION,
  CODE_RESPONSES,
} = require("./constants");

// Initialize Prisma Client
const prisma = new PrismaClient();

const hash = async (strToHash) => {
  return await bcrypt.hash(strToHash, bcrypt.genSaltSync(SALT));
};

const generateToken = () => {
  return crypto.randomBytes(TOKEN_LENGTH).toString("hex");
};

const verifyHashValue = async (value, hashedValue) => {
  return await bcrypt.compare(value, hashedValue);
};

/** * Signs a JWT token with the given user data and secret key.
 * @param {Object} user - The user object containing id and email.
 * @param {string} secretKey - The secret key to sign the token.
 * @param {string} expiresIn - The expiration time for the token.
 * @returns {string} - The signed JWT token.
 */

const signToken = (userId, secretKey, expiresIn) => {
  const payload = {
    userId,
  };
  return jwt.sign(payload, secretKey, {
    expiresIn: expiresIn,
  });
};

const createSendAccessToken = async (userId, res, rememberMe) => {
  console.log("Creating and sending access token for user ID:", userId);

  const accessToken = signToken(
    userId,
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRATION
  );
  // If rememberMe is true, create a remember me token
  if (rememberMe) {
    await createRememberMeToken(userId, res);
  } else {
    res.clearCookie("rememberMeToken");
  }

  return res.status(CODE_RESPONSES.SUCCESS).json({ token: accessToken });
};

/**
 * Creates a remember me token for the user. and stores it in the database.
 * It also sets a cookie in the response with the token.
 * @param {*} userId
 * @returns
 */
const createRememberMeToken = async (userId, res) => {
  console.log("Creating remember me token for user ID:", userId);
  const rememberMeToken = signToken(
    userId,
    REMEMBER_ME_TOKEN_SECRET,
    REMEMBER_ME_TOKEN_EXPIRATION
  );
  // Store the remember me token in databse
  const expiresAt = new Date(Date.now() + COOKIE_EXPIRATION);

  try {
    await prisma.rememberMeToken.create({
      data: {
        token: await hash(rememberMeToken),
        userId: userId,
        expiresAt,
      },
    });
    res.cookie("rememberMeToken", rememberMeToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_EXPIRATION,
    });
    return rememberMeToken;
  } catch (error) {
    console.error("Error creating remember me token:", error);
    // dont break login flow if there is an error
  }
};

const clearRememberMeToken = async (req, res) => {
  try {
    const rememberMeToken = req.cookies.rememberMeToken;
    if (rememberMeToken) {
      // delete from database
      prisma.rememberMeToken.deleteMany({
        where: {
          token: await hash(rememberMeToken),
          userId: req.userId,
        },
      });
      // clear cookie
      res.clearCookie("rememberMeToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: COOKIE_EXPIRATION,
      });
    }
  } catch (err) {
    console.log("Error clearing remember me token:", err);
  }
};

module.exports = {
  signToken,
  hash,
  verifyHashValue,
  generateToken,
  createSendAccessToken,
  createRememberMeToken,
  clearRememberMeToken,
};
