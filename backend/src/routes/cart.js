const Router = require("express").Router();
const {
  addToCart,
  removeFromCart,
  getCartItems,
} = require("../controller/cartController");

Router.post("/items", addToCart);
Router.delete("/items/:id", removeFromCart);
Router.get("/items", getCartItems);

module.exports = Router;
