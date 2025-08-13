const {
  getAllProducts,
  getProductsByCategory,
} = require("../controller/productsController");

const router = require("express").Router();
router.get("/", getAllProducts);
router.get("/category/:categoryId", getProductsByCategory);

module.exports = router;
