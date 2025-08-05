const { checkAuth } = require("../controller/authController");

const router = require("express").Router();

router.post("/check-auth", checkAuth);

module.exports = router;
