const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require("../generated/prisma/client");
const { CODE_RESPONSES } = require("../utils/constants");
const prisma = new PrismaClient();

const handleWebhook = async (req, res) => {
  const payload = req.body;
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // 1. Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res
      .status(CODE_RESPONSES.BAD_REQUEST)
      .send({ error: `Webhook Error: ${err.message}` });
  }

  // 2. Handle the event
  console.log("Received Stripe event:", event.type);

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    console.log("PaymentIntent was successful!", paymentIntent.id);

    // 3. Trigger your transaction logic here
    try {
      // Find the cart associated with this payment intent
      const cart = await prisma.cart.findFirst({
        where: { paymentIntentId: paymentIntent.id },
        include: { cartItems: { include: { productModel: true } } },
      });

      if (!cart) {
        console.error("Cart not found for payment intent:", paymentIntent.id);
        return res.status(CODE_RESPONSES.NOT_FOUND).send("Cart not found");
      }

      const bill = await prisma.$transaction(async (tx) => {
        // 1. Verify cart items quantities
        for (const item of cart.cartItems) {
          if (item.quantity > item.productModel.stock) {
            throw new Error(`Insufficient stock for item ${item.id}`);
          }
        }

        // 2. create bill and orders
        const bill = await tx.bill.create({
          data: {
            userId: cart.userId,
            amount: paymentIntent.amount,
            orders: {
              createMany: {
                data: cart.cartItems.map((item) => ({
                  productModelId: item.productModelId,
                  quantity: item.quantity,
                  price: item.price,
                })),
              },
            },
          },
        });

        // 3. update product model stock
        for (const item of cart.cartItems) {
          await tx.productModel.update({
            where: { id: item.productModelId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // 4. clear cart
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
        await tx.cart.update({
          where: { id: cart.id },
          data: { paymentIntentId: null, totalCart: 0 },
        });

        return bill;
      });
      if (!bill) {
        console.error("Bill creation failed");
        return res
          .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
          .send("Bill creation failed");
      }
      res
        .status(CODE_RESPONSES.SUCCESS)
        .json({ message: "Payment processed successfully", data: bill });
    } catch (dbError) {
      console.error("Database transaction failed:", dbError);
      res
        .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ received: false, error: "Database transaction failed" });
    }
  } else {
    console.log(`Unhandled event type ${event.type}`);
    res.status(CODE_RESPONSES.SUCCESS).json({ received: true });
  }
};

module.exports = {
  handleWebhook,
};
