const GOOD_PASSWORD_SCORE = 3; // Minimum score for a good password

const CODE_RESPONSES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports = {
  SALT: 10, // Salt rounds for password hashing
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION: "1h", // Access token expiration time
  REMEMBER_ME_TOKEN_SECRET: process.env.REMEMBER_ME_TOKEN_SECRET,
  REMEMBER_ME_TOKEN_EXPIRATION: "1d", // Remember me token expiration time
  COOKIE_JWT_EXPIRATION: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
  COOKIE_REMEMBER_ME_EXPIRATION: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  CODE_RESPONSES,
  GOOD_PASSWORD_SCORE,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+/,
  TOKEN_LENGTH: 64,
};
