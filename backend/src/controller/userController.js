/**
 * Controller for user registration and login.
 * Handles user registration and login functionality.
 * Uses Prisma ORM for database operations.
 */

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { PrismaClient, Prisma } = require("../generated/prisma/client");
const {
  isValidEmail,
  isValidMobileNumber,
  isGoodPassword,
} = require("../utils/validationUtils");
const { CODE_RESPONSES } = require("../utils/constants");

const Email = require("../utils/sendMails");
const {
  hash,
  verifyHashValue,
  generateToken,
  createSendAccessToken,
  clearRememberMeToken,
} = require("../utils/authUtils");
const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  console.log("Processing registration request for email:", req.body);
  const { email, password, firstName, lastName, mobile, address } = req.body;
  if (!email || !password || !firstName || !lastName || !mobile) {
    return res.status(CODE_RESPONSES.BAD_REQUEST).json({
      error: "missing_fields",
      message:
        "All fields [email, password, firstName, lastName, mobile] are required",
    });
  }
  // Validate email format
  if (!isValidEmail(email)) {
    return res
      .status(CODE_RESPONSES.BAD_REQUEST)
      .json({ error: "bad_input", message: "Email address is invalid!" });
  }
  // Validate Phone number format
  if (!isValidMobileNumber(mobile)) {
    return res
      .status(CODE_RESPONSES.BAD_REQUEST)
      .json({ error: "bad_input", message: "Mobile number is invalid!" });
  }

  //Validate password
  if (!isGoodPassword(password)) {
    return res
      .status(CODE_RESPONSES.BAD_REQUEST)
      .json({ error: "bad_input", message: "Password is not strong enough!" });
  }

  const hashedPassword = await hash(password);
  // Create a new user
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        mobile,
        address,
      },
    });

    return res.status(CODE_RESPONSES.CREATED).json({ newUser });
  } catch (error) {
    console.log(error);
    let errMsg = error;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002: Unique constraint failed on the {constraint}
      if (error.code === "P2002") {
        // Check which field caused the unique constraint error
        if (error.meta && Array.isArray(error.meta.target)) {
          if (error.meta.target.includes("email")) {
            errMsg = "This email address is already registered.";
          }
          if (error.meta.target.includes("mobile")) {
            errMsg = "This mobile number is already registered.";
          }
        } else {
          errMsg = "A user with the provided email or mobile already exists.";
        }
        return res
          .status(CODE_RESPONSES.CONFLICT)
          .json({ error: "duplicate user", message: errMsg });
      }
    }
    return res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error });
  }
};

const login = async (req, res) => {
  console.log("Processing login request for email:", req.body.email);
  const { email, password, rememberMe } = req.body;
  if (!email || !password) {
    return res.status(CODE_RESPONSES.BAD_REQUEST).json({
      error: "missing_fields",
      message: "All fields [email, password] are required",
    });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(CODE_RESPONSES.BAD_REQUEST)
        .json({ error: "invalid_input", message: "Invalid email or password" });
    }
    const isValidPassword = await verifyHashValue(password, user.password);
    if (!isValidPassword) {
      return res
        .status(CODE_RESPONSES.UNAUTHORIZED)
        .json({ error: "invalid_input", message: "Invalid email or password" });
    }
    return createSendAccessToken(user.id, res, rememberMe);
  } catch (error) {
    console.log(error);
    return res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error, message: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  console.log("Processing forgot password request for email:", req.body.email);
  const { email } = req.body;
  if (!email) {
    return res
      .status(CODE_RESPONSES.BAD_REQUEST)
      .json({ error: "missing fields", message: "Email is required!" });
  }
  // todo: Check for recent requests from the same IP or for the same email. If the limit is exceeded, return an error.
  // check if email exist
  const MESSAGE =
    "If an account with that email exists, a reset link has been sent.";
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(CODE_RESPONSES.SUCCESS).json({
      message: MESSAGE,
    });
  }
  //Create a secure token
  const resetToken = generateToken();
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 10);

  // Store token to database
  await prisma.passwordResetTokens.create({
    data: {
      userId: user.id,
      hashedToken: hashedResetToken,
      expiresAt: resetTokenExpiry,
    },
  });

  // Create reset link and send it via email
  const resetLink = `${process.env.MY_DOMAIN}reset-password?token=${resetToken}`;
  try {
    await new Email(user, resetLink).sendPasswordReset();
    console.log("Email was sent successfully!");
    return res.status(CODE_RESPONSES.SUCCESS).json({ message: MESSAGE });
  } catch (err) {
    console.log("Failed to send reset link via email.", err);
    return res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: "Server_error", message: err });
  }
};

const resetPassword = async (req, res) => {
  console.log("Resetting password for user with ID:", req.userId);
  const { newPassword, token } = req.body;
  if (!newPassword || !token) {
    return res.status(CODE_RESPONSES.BAD_REQUEST).json({
      error: "missing_fields",
      message: "Token and new password are required.",
    });
  }
  // hash token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  try {
    // Validate the token and update the user's password
    const updatedUser = await prisma.$transaction(async (tx) => {
      // find token in database
      const tokenFound = await tx.passwordResetTokens.findFirst({
        where: { hashedToken, used: false },
      });
      console.log(
        "Current Time: ",
        new Date().getTime(),
        "expire Time",
        tokenFound.expiresAt.getTime()
      );

      if (
        !tokenFound ||
        new Date().getTime() >= tokenFound.expiresAt.getTime() ||
        tokenFound.used
      ) {
        console.log("Not_valid/ expired token");
        return null;
      }
      //Validate password
      if (!isGoodPassword(newPassword)) {
        return res.status(CODE_RESPONSES.BAD_REQUEST).json({
          error: "bad_input",
          message: "Password is not strong enough!",
        });
      }
      // token and password are valid, update the user's password
      const hashedPassword = await hash(newPassword);
      const updatedUser = await tx.user.update({
        where: {
          id: tokenFound.userId,
        },
        data: {
          password: hashedPassword,
          lastPasswordChangeAt: new Date(),
        },
      });
      // invalidate token from database
      await tx.passwordResetTokens.update({
        where: {
          id: tokenFound.id,
        },
        data: {
          used: true,
        },
      });
      return updatedUser;
    });
    if (!updatedUser) {
      return res.status(CODE_RESPONSES.BAD_REQUEST).json({
        error: "invalid_or_expired_token",
        message:
          "The password reset token is invalid or has expired. Please request a new password reset link.",
      });
    }
    res
      .status(CODE_RESPONSES.SUCCESS)
      .json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password reset transaction failed:", err);
    res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: "server_error", message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    console.log("Logging out user with ID:", req.userId);
    await clearRememberMeToken(req, res);
    return res
      .status(CODE_RESPONSES.SUCCESS)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout failed:", error);
    return res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: "server_error", message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  login,
  forgotPassword,
  resetPassword,
  logout,
};
