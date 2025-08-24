// This middleware checks for a valid JWT in the Authorization header.
// If the token is valid, it attaches the user ID to the request object and calls next() to proceed.
// If the token is missing or invalid, it responds with an appropriate error message and status code.
// This is useful for protecting routes that require authentication, ensuring that only authenticated users can access them
// and perform actions that require user identification.

const jwt = require("jsonwebtoken");
const {
  CODE_RESPONSES,
  ACCESS_TOKEN_SECRET,
  REMEMBER_ME_TOKEN_SECRET,
} = require("../utils/constants");
const { PrismaClient } = require("../generated/prisma/client");
const {
  verifyHashValue,
  createSendAccessToken,
} = require("../utils/authUtils");
const AppError = require("../utils/appUtils");
const prisma = new PrismaClient();

const verifyJWT = async (req, res, next) => {
  let token;
  // 1) Get token from header (for regular access)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2) Get token from cookie (for "Remember Me" flow)
  if (!token && req.cookies.jwt) {
    // Check for JWT cookie first
    token = req.cookies.jwt;
  }
  if (!token) {
    // check if there is a remember me token in cookies
    const rememberMeToken = req.cookies?.rememberMeToken;
    if (rememberMeToken) {
      // If remember me token is present, we can verify it
      return await refreshJWTwithRememberMe(req, res, next);
    }
    return next(
      new AppError("Access token is required", CODE_RESPONSES.UNAUTHORIZED)
    );
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      // Handle token expiration or invalid signature
      if (err instanceof jwt.TokenExpiredError) {
        return next(
          new AppError(
            "Authentication token has expired.",
            CODE_RESPONSES.FORBIDDEN
          )
        );
      }
      if (err instanceof jwt.JsonWebTokenError) {
        return next(
          new AppError(
            "Invalid authentication token.",
            CODE_RESPONSES.FORBIDDEN
          )
        );
      }

      return next(
        new AppError("Invalid authentication token.", CODE_RESPONSES.FORBIDDEN)
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      return next(new AppError("User not found", CODE_RESPONSES.UNAUTHORIZED));
    }
    if (decoded.iat * 1000 < user.lastPasswordChangeAt.getTime()) {
      // Token was issued BEFORE the password was last changed.
      // This token is now invalid and should be rejected.
      return next(
        new AppError(
          "Session has expired due to a password change. Please log in again.",
          CODE_RESPONSES.UNAUTHORIZED
        )
      );
    }
    req.userId = decoded.userId;
    req.username = user.firstName + " " + user.lastName;
    next();
  });
};

const refreshJWTwithRememberMe = async (req, res, next) => {
  const rememberMeToken = req.cookies?.rememberMeToken;
  if (!rememberMeToken) {
    return next(
      new AppError("Remember me token is required", CODE_RESPONSES.UNAUTHORIZED)
    );
  }
  // get remember me token from database
  const validRememberMeTokens = await prisma.rememberMeToken.findMany({
    where: {
      expiresAt: {
        gt: new Date(), // Check if the token is not expired
      },
    },
  });
  if (validRememberMeTokens.length === 0) {
    res.clearCookie("rememberMeToken");
    return next(
      new AppError(
        "Invalid or expired remember me token.",
        CODE_RESPONSES.FORBIDDEN
      )
    );
  }
  let validRememberMeToken = null;
  for (const token of validRememberMeTokens) {
    if (await verifyHashValue(rememberMeToken, token.token)) {
      validRememberMeToken = token;
      break;
    }
  }
  if (!validRememberMeToken) {
    // If no valid remember me token found, remove the cookie
    res.clearCookie("rememberMeToken");
    prisma.rememberMeToken.deleteMany({
      where: {
        id: validRememberMeToken.id,
      },
    });
    return next(
      new AppError(
        "Invalid or expired remember me token.",
        CODE_RESPONSES.FORBIDDEN
      )
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: validRememberMeToken.userId },
  });
  if (!user) {
    return next(new AppError("User not found", CODE_RESPONSES.UNAUTHORIZED));
  }
  // If the token is valid, we can create a new access token
  console.log("Refreshing access token for user ID:", user.id);
  await createSendAccessToken(user.id, res, true);

  req.userId = user.id;
  req.username = user.firstName + " " + user.lastName;
  next();
};

module.exports = {
  verifyJWT,
  refreshJWTwithRememberMe,
};
