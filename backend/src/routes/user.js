const { checkAuth, getUserProfile } = require("../controller/userController");

const router = require("express").Router();

router.post("/check-auth", checkAuth);
router.get("/profile", getUserProfile);

module.exports = router;
