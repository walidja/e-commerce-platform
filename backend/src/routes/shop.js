const Router = require("express").Router();
const verifyShopOwner = require("../middleware/verifyShopOwnership");
const upload = require("../Config/multerConfig");

const {
  createShop,
  getShopByUserId,
  addShopProduct,
  getShopProducts,
} = require("../controller/shopController");

Router.post("/", createShop);
Router.get("/", getShopByUserId);
Router.get("/products/:id", getShopProducts);
Router.post(
  "/products/:id",
  verifyShopOwner,
  upload.array("models_image"),
  addShopProduct
);

module.exports = Router;
