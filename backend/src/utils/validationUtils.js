const { isValidPhoneNumber } = require("libphonenumber-js");
const zxcvbn = require("zxcvbn");
const { GOOD_PASSWORD_SCORE, EMAIL_REGEX } = require("./constants");

const isGoodPassword = (password) => {
  const strengthScore = zxcvbn(password).score;
  return strengthScore >= GOOD_PASSWORD_SCORE;
};

const isValidEmail = (email) => {
  const emailRegex = EMAIL_REGEX;
  if (!emailRegex.test(email)) {
    return false;
  }
  return true;
};

const isValidMobileNumber = (phone) => {
  return isValidPhoneNumber(phone);
};

module.exports = {
  isGoodPassword,
  isValidEmail,
  isValidMobileNumber,
};
