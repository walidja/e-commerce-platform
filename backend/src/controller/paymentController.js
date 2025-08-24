const { PrismaClient } = require("../generated/prisma/client");
const { CODE_RESPONSES } = require("../utils/constants");
const prisma = new PrismaClient();
const stripe = require("stripe").Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const { userId } = req; // Assuming userId is populated by your auth middleware

    // 1. Find the cart and calculate the total amount securely on the backend.
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        cartItems: {
          include: { productModel: true },
        },
      },
    });

    if (!cart) {
      return res
        .status(CODE_RESPONSES.NOT_FOUND)
        .json({ error: "CART_NOT_FOUND", message: "Cart not found." });
    }
    if (cart.cartItems.length === 0) {
      return res
        .status(CODE_RESPONSES.BAD_REQUEST)
        .json({ error: "EMPTY_CART", message: "Cart is empty." });
    }

    // 2. Calculate the amount securely on the backend, not from the request body.
    const totalAmount = cart.cartItems.reduce(
      (sum, item) => sum + item.productModel.price * item.quantity * 100,
      0
    );

    let paymentIntent;
    console.log("Cart total amount (in cents):", totalAmount);

    // 3. Retrieve or create a new PaymentIntent based on the cart's paymentIntentId.
    if (cart.paymentIntentId) {
      // Retrieve and UPDATE the existing PaymentIntent to ensure amount is correct.
      paymentIntent = await stripe.paymentIntents.update(cart.paymentIntentId, {
        amount: totalAmount,
      });
      console.log("Updated existing PaymentIntent:", paymentIntent.id);
    } else {
      // Create a new PaymentIntent.
      paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: "usd", // Use a standard currency from your app config
        automatic_payment_methods: { enabled: true },
      });

      // Update the cart with the new PaymentIntent ID atomically.
      await prisma.cart.update({
        where: { id: cart.id },
        data: { paymentIntentId: paymentIntent.id },
      });
      console.log(
        "Created and updated cart with new PaymentIntent:",
        paymentIntent.id
      );
    }

    return res
      .status(CODE_RESPONSES.SUCCESS)
      .json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error in createPaymentIntent:", error);
    return res.status(CODE_RESPONSES.INTERNAL_SERVER_ERROR).json({
      error: "FAILED_PAYMENT_INTENT",
      message: "Failed to create payment intent.",
    });
  }
};

module.exports = {
  createPaymentIntent,
};
