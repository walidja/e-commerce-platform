const { handleWebhook } = require("../../controller/stripeWebhookController");
const express = require("express");
const stripeRouter = express.Router();
stripeRouter.post(
  "/payment",
  express.raw({ type: "application/json" }),
  handleWebhook
);

module.exports = stripeRouter;
