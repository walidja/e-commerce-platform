const { getAllProducts } = require("../controller/productsController");

const router = require("express").Router();
router.get("/", getAllProducts);

module.exports = router;
