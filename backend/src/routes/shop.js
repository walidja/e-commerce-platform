const Router = require("express").Router();
const verifyShopOwner = require("../middleware/verifyOwner");

const {
  createShop,
  getShopByUserId,
  addShopProduct,
  getShopProducts,
} = require("../controller/shopController");
Router.post("/", createShop);
Router.get("/", getShopByUserId);
Router.get("/products/:id", getShopProducts);
Router.post("/products/:id", addShopProduct, verifyShopOwner);

module.exports = Router;
