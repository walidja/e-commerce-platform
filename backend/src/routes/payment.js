const { createPaymentIntent } = require("../controller/paymentController");

const Router = require("express").Router();
Router.post("/create-payment-intent", createPaymentIntent);

module.exports = Router;
