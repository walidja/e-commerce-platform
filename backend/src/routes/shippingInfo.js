const Router = require("express").Router();
const {
  getShippingInfo,
  updateShippingInfo,
} = require("../controller/shippingInfoController");

Router.get("/", getShippingInfo);
Router.put("/", updateShippingInfo);

module.exports = Router;
