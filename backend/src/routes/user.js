const {
  registerUser,
  login,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controller/userController");
const router = require("express").Router();

router.route("/login").post(login);
router.route("/register").post(registerUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/logout").post(logout);

module.exports = router;
