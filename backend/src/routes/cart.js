const Router = require("express").Router();
const {
  addToCart,
  removeFromCart,
  removeAllCartItems,
  getCart,
  updateCartItems,
} = require("../controller/cartController");
Router.route("/items/:id").delete(removeFromCart);
Router.route("/").get(getCart).post(addToCart);
Router.route("/:id/items").delete(removeAllCartItems).put(updateCartItems);

module.exports = Router;
